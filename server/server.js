const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/test', (req, res) => {
  res.json({ status: "ALIVE" });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ACTIVE on http://0.0.0.0:${PORT}`);
});