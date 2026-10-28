import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    // The MCP gateway authenticates requests and replaces this header upstream.
    res.set('Cache-Control', 'no-store');
    res.json({ userId: req.get('x-user-id') || null });
});

export default router;
