import express from 'express';
const PORT = 4040;
const server = express();
server.get('/', (_req, res) => {
    res.json({ test: 'hey' });
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map