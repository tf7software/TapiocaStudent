document.getElementById('ask-btn').addEventListener('click', async () => {
    const question = document.getElementById('question').value;
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = 'Thinking...';

    // Hide the copy button when a new question is asked
    document.getElementById('copy-btn').style.display = 'none';

    // Determine the response type based on the toggle switch
    const responseType = document.getElementById('toggle-response-type').checked ? 'student' : 'question';

    const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, responseType })
    });
    
    const data = await response.json();
    responseDiv.innerHTML = data.answer;

    // Show the copy button after receiving the response
    document.getElementById('copy-btn').style.display = 'block';
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const responseText = document.getElementById('response').innerText;
    navigator.clipboard.writeText(responseText)
        .then(() => alert('Response copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
});

// Hide the copy button initially
document.getElementById('copy-btn').style.display = 'none';
