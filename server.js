// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 200
      })
    });

    const data = await response.json();
    console.log('OpenAI raw response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.json({ reply: "Sorry, I couldn't get a proper response from OpenAI." });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error('OpenAI request error:', err);
    res.status(500).json({ reply: "Sorry, I couldn't get a proper response from OpenAI." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
