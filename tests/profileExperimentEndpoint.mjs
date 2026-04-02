import { spawn } from 'node:child_process';

const rounds = Number(process.env.PROFILE_ROUNDS || 5);
const warmupRounds = Number(process.env.PROFILE_WARMUP_ROUNDS || 1);
const proteinName = process.env.PROFILE_EXPERIMENT_ID || 'DPX000004';
const profilePort = Number(process.env.PROFILE_PORT || 8090);

const requestUrl = `http://127.0.0.1:${profilePort}/api/v1/experiment?experimentID=${encodeURIComponent(proteinName)}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseServerTiming = (headerValue) => {
  if (!headerValue) {
    return {};
  }

  return headerValue
    .split(',')
    .map((part) => part.trim())
    .reduce((acc, metric) => {
      const [name, ...attrs] = metric.split(';');
      const durPart = attrs.find((a) => a.startsWith('dur='));
      if (!name || !durPart) {
        return acc;
      }

      const value = Number(durPart.slice(4));
      if (!Number.isFinite(value)) {
        return acc;
      }

      acc[name] = value;
      return acc;
    }, {});
};

const average = (values) => {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const startServer = async () => {
  const server = spawn('node', ['index.mjs'], {
    env: {
      ...process.env,
      PORT: String(profilePort),
      PROFILE_EXPERIMENT_ENDPOINT: '1'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let startupOutput = '';
  server.stdout.on('data', (chunk) => {
    startupOutput += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    startupOutput += chunk.toString();
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:' + profilePort + '/api/v1/experiments');
      if (response.ok) {
        return { server, startupOutput };
      }
    } catch {
      // keep waiting
    }
    await sleep(500);
  }

  server.kill('SIGTERM');
  throw new Error('Server did not become ready. Output:\n' + startupOutput);
};

const run = async () => {
  const { server } = await startServer();
  const requestSamples = [];
  const stageSamples = {};

  try {
    for (let i = 0; i < warmupRounds + rounds; i += 1) {
      const startedAt = performance.now();
      const response = await fetch(requestUrl);
      const elapsedMs = performance.now() - startedAt;
      const serverTiming = parseServerTiming(response.headers.get('server-timing'));

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Request failed status=${response.status} body=${body}`);
      }

      if (i >= warmupRounds) {
        requestSamples.push(elapsedMs);
        Object.entries(serverTiming).forEach(([key, value]) => {
          if (!stageSamples[key]) {
            stageSamples[key] = [];
          }
          stageSamples[key].push(value);
        });
      }
    }

    const stageAverages = Object.fromEntries(
      Object.entries(stageSamples).map(([key, values]) => [key, Number(average(values).toFixed(3))])
    );

    console.log(JSON.stringify({
      endpoint: requestUrl,
      rounds,
      warmupRounds,
      avgRequestMs: Number(average(requestSamples).toFixed(3)),
      minRequestMs: Number(Math.min(...requestSamples).toFixed(3)),
      maxRequestMs: Number(Math.max(...requestSamples).toFixed(3)),
      avgServerTimingMs: stageAverages
    }, null, 2));
  } finally {
    server.kill('SIGTERM');
    await sleep(300);
  }
};

run().catch((error) => {
  console.error('[profile:experiment] failed:', error.message);
  process.exitCode = 1;
});
