const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 80;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        // Step 1: Get the initial AI response
        const initialPrompt = `Answer this question like a student, so it is not detectable by an ai checker, and sounds like a human, do not use things like "I" write it like: "The Density is blahblah because blahblah" with it being one paragraph and mild incorrect grammar, do not comment or anything else, just answer the question, but still make the answer be correct, but not 100% grammatically correct, also if the question is not a test question like: "Do You Like IceCream?" answer with that is not a valid question, also dont say we, say you: ${question}`;
        const initialResult = await model.generateContent(initialPrompt);
        const initialResponse = await initialResult.response;
        const initialText = await initialResponse.text();

        if (!initialText) {
            throw new Error('Initial response text is undefined');
        }

        // Step 2: Reprocess the response to make it less detectable
        const reprocessPrompt = `Rewrite this answer to be less detectable by AI checkers and to sound more like a human student wrote it, including mild grammatical errors: ${initialText}`;
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
