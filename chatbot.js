// Improved chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotInterface = document.querySelector('.chatbot-interface');
    const closeChatbot = document.querySelector('.close-chatbot');
    const sendButton = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Toggle chat interface
    chatbotIcon.addEventListener('click', function() {
        const isVisible = chatbotInterface.style.display === 'flex';
        chatbotInterface.style.display = isVisible ? 'none' : 'flex';
        
        // Add welcome message if first time opening
        if (!isVisible && chatMessages.children.length === 0) {
            addBotMessage("Hello! I'm your Well-Sync Medical Assistant. I can provide general health information, but remember I'm not a substitute for professional medical advice. How can I help you today?");
        }
    });
    
    // Close chat interface
    closeChatbot.addEventListener('click', function() {
        chatbotInterface.style.display = 'none';
    });
    
    // Add a message to the chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        typingDiv.setAttribute('aria-live', 'polite');
        typingDiv.setAttribute('aria-label', 'Assistant is typing');
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message to backend
    async function sendMessageToBackend(message) {
        try {
            showTypingIndicator();
            sendButton.disabled = true;
            
            const response = await fetch('/process-medical-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // For CSRF protection
                },
                body: JSON.stringify({
                    query: message
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }
            
            if (data.answer) {
                addMessage(data.answer, false);
            } else {
                throw new Error('No answer received');
            }
        } catch (error) {
            addMessage("Sorry, I encountered an error. Please try again later.", false);
            console.error('Error:', error);
        } finally {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            sendButton.disabled = false;
            chatInput.focus();
        }
    }
    
    // Handle sending a message
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            sendMessageToBackend(message);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Focus input when chat opens
    chatbotIcon.addEventListener('click', function() {
        setTimeout(() => chatInput.focus(), 100);
    });
});