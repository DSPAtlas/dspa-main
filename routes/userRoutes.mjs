import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
    // Per-user mode exposes only the principal accepted by trusted middleware.
    // Shared mode retains the development gateway's existing identity display.
    res.json({ userId: req.userContext?.principal ?? (req.get('x-user-id') || null) });
});

export default router;
