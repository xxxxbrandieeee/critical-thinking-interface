// server.js  optimized version
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const OPENAI_API_KEY = ""; // Add your own API key here

const app = express();

const PORT = 4001;
app.use(cors({
     origin: '*'
}));
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//     next();
// });
const emailRouter = require("./email");
// ---------- 1. Connection ----------
// const pool = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'questionnaire',
//   password: 'ehxAswLLDeCAjZda',
//   database: 'questionnaire',
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 30,          // max concurrent connections
//   idleTimeout: 60000,
//   queueLimit: 0
// });

// ---------- 2. Middleware ----------

app.use(bodyParser.json({ limit: '3mb' })); // prevent oversized body
app.use("/email", emailRouter);

// ---------- 3. Utilities ----------
const writeData = (data, type) => {
  try {
    const dir = path.join(__dirname, type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const fileName = path.join(dir, `userData_${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('writeData error:', e);
  }
};

// ---------- 4. Routes ----------
app.get('/report', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').replace('::ffff:', '');
  res.json({ code: 200, ip });
});


app.post('/api/response', (req, res) => {
  const { data, type } = req.body;
  writeData(data, type);
  res.json({ message: 'Data received successfully.' });
});

app.post('/api/chat', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing prompt' });

  const key = OPENAI_API_KEY;
  try {
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: 'gpt-4-turbo', messages: [{ role: 'user', content }], max_tokens: 2048 },
      {
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        maxContentLength: 1024 * 1024,        // 1 MB limit [^29^]
        timeout: 30000
      }
    );
    res.json(resp.data);
  } catch (e) {
    console.error('OpenAI error:', e.message);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.post('/api/system/chat', async (req, res) => {
  const { content, type, prompt,model } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing prompt' });

  const key = type === 'variation2' ? OPENAI_API_KEY2 : OPENAI_API_KEY1;
  try {
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model:model|| 'gpt-4-turbo', messages: 
        [
          { role: 'user', content },
          { role: 'system', content:prompt }
        ], 
        max_tokens: 2048 },
      {
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        maxContentLength: 1024 * 1024,        // 1 MB limit [^29^]
        timeout: 30000
      }
    );
    res.json(resp.data);
  } catch (e) {
    console.error('OpenAI error:', e.message);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

// ---------- 5. Start Server ----------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));