document.getElementById('ask-btn').addEventListener('click', async () => {
    const question = document.getElementById('question').value;
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = 'Thinking...';

    const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
    });
    
    const data = await response.json();
    responseDiv.innerHTML = data.answer;
});
