// Disposable-server fixture for dspa-mcp/tests/test_backend_flow.py.
import fs from 'node:fs/promises';
import http from 'node:http';
import db from '../../dspa-backend/config/database.js';

// Public annotation responses are seeded in UNIPROT_CACHE_DIR by the runner.
// A miss must fail the test rather than contact an external service.
globalThis.fetch = async () => { throw new Error('Unexpected external annotation request in backend flow test'); };

// Run the unchanged production startup on an ephemeral loopback listener.
process.env.PORT = '0';
const listen = http.Server.prototype.listen;
http.Server.prototype.listen = function (port, callback) {
  return listen.call(this, port, '127.0.0.1', callback);
};
let server;
try {
  ({ server } = await import('../index.mjs'));
} finally {
  http.Server.prototype.listen = listen;
}
if (!server.listening) {
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
}
await fs.writeFile(process.env.DSPA_BACKEND_TEST_READY_FILE, JSON.stringify({ port: server.address().port }));

const stop = async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  await db.end();
};
process.once('SIGTERM', () => stop().then(() => process.exit(0), () => process.exit(1)));
process.once('SIGINT', () => stop().then(() => process.exit(0), () => process.exit(1)));
