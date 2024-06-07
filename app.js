const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        const initialPrompt = `Answer this question like a student, so it is not detectable by an AI checker, and sounds like a human. Do not use pronouns like "I" and avoid perfect grammar. Answer: ${question}`;
        const initialResult = await model.generateContent(initialPrompt);
        const initialResponse = await initialResult.response;
        const initialText = await initialResponse.text();

        if (!initialText) {
            throw new Error('Initial response text is undefined');
        }

        const reprocessPrompt = `Rewrite this answer to sound more like a human student wrote it, including mild grammatical errors: ${initialText}`;
        const reprocessResult = await model.generateContent(reprocessPrompt);
        const reprocessResponse = await reprocessResult.response;
        const reprocessedText = await reprocessResponse.text();

        if (!reprocessedText) {
            throw new Error('Reprocessed response text is undefined');
        }

        res.json({ answer: reprocessedText });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/makeitzero', async (req, res) => {
    const { text } = req.body;

    try {
        const initialPrompt = `Rewrite this text to make it undetectable by AI detectors while keeping the original meaning: ${text}`;
        const initialResult = await model.generateContent(initialPrompt);
        const initialResponse = await initialResult.response;
        const initialText = await initialResponse.text();

        if (!initialText) {
            throw new Error('Initial response text is undefined');
        }

        const reprocessPrompt = `Rewrite this text to sound more natural and less detectable by AI detectors: ${initialText}`;
        const reprocessResult = await model.generateContent(reprocessPrompt);
        const reprocessResponse = await reprocessResult.response;
        const reprocessedText = await reprocessResponse.text();

        if (!reprocessedText) {
            throw new Error('Reprocessed response text is undefined');
        }

        res.json({ answer: reprocessedText });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
