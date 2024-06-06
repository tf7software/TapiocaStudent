const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        const prompt = `Answer this question like a student, so it is not detectable by an ai checker, and sounds like a human, do not use things like "I" write it like: "The Density is blahblah because blahblah" with it being one paragraph and mild incorrect grammar, do not comment or anything else, just answer the question, but still make the answer be correct, but not 100% grammatically correct: ${question}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        res.json({ answer: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
