const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

/**
 * @type {{role: 'user' | 'model', text: string}[]}
 */
let conversationHistory = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to history and UI
  conversationHistory.push({ role: 'user', text: userMessage });
  appendMessage('user', userMessage);
  input.value = '';

  // Show a "thinking" message and get a reference to it
  const thinkingMessageElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation: conversationHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server.');
    }

    const result = await response.json();

    if (result.success && result.data) {
      // Update the "thinking" message with the actual response
      thinkingMessageElement.textContent = result.data;
      // Add bot response to history
      conversationHistory.push({ role: 'model', text: result.data });
    } else {
      // Handle cases where the API returns success:false or no data
      thinkingMessageElement.textContent =
        result.message || 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error:', error);
    // Update the "thinking" message with an error
    thinkingMessageElement.textContent =
      error.message || 'Sorry, something went wrong.';
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element to allow modification
}
