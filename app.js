const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/ask', async (req, res) => {
    const { question, responseType } = req.body;

    try {
        let initialPrompt, reprocessPrompt;

        if (responseType === 'student') {
            // Student-like response
            initialPrompt = `Answer this question like a student, so it is not detectable by an AI checker, and sounds like a human. Do not use pronouns like "I" and avoid perfect grammar. Answer: ${question}`;
            reprocessPrompt = `Rewrite this answer to sound more like a human student wrote it, including mild grammatical errors: `;
        } else if (responseType === 'question') {
            // Answering a question response
            initialPrompt = `Answer this question like a student, so it is not detectable by an AI checker, and sounds like a human. Do not use pronouns like "I" and avoid perfect grammar.: ${question}`;
            reprocessPrompt = `Rewrite this answer to sound more natural, and formal, but still with gramatical errors: `;
        } else {
            throw new Error('Invalid response type');
        }

        // Step 1: Get the initial AI response
        const initialResult = await model.generateContent(initialPrompt);
        const initialResponse = await initialResult.response;
        const initialText = await initialResponse.text();

        if (!initialText) {
            throw new Error('Initial response text is undefined');
        }

        // Step 2: Reprocess the response to make it less detectable
        const reprocessResult = await model.generateContent(reprocessPrompt + initialText);
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
