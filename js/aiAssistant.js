// AI News Assistant - Chat Interface
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.init();
    }

    init() {
        this.createChatInterface();
        this.setupEventListeners();
    }

    createChatInterface() {
        const assistantHTML = `
            <div class="ai-assistant">
                <div class="assistant-header">
                    <h3>🤖 AI News Assistant</h3>
                    <button class="close-assistant">&times;</button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Ask about news, trends, or summaries..." class="message-input">
                    <button class="send-message">Send</button>
                </div>
                <div class="quick-questions">
                    <button class="quick-question" data-question="What's trending today?">Trending</button>
                    <button class="quick-question" data-question="Summarize today's top news">Summary</button>
                    <button class="quick-question" data-question="Predict tomorrow's news">Predict</button>
                </div>
            </div>
            <button class="assistant-toggle">
                <i class="fas fa-robot"></i>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', assistantHTML);
    }

    setupEventListeners() {
        // Toggle assistant
        document.querySelector('.assistant-toggle').addEventListener('click', () => {
            this.toggleAssistant();
        });

        // Close assistant
        document.querySelector('.close-assistant').addEventListener('click', () => {
            this.closeAssistant();
        });

        // Send message
        document.querySelector('.send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        document.querySelector('.message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick questions
        document.querySelectorAll('.quick-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                document.querySelector('.message-input').value = question;
                this.sendMessage();
            });
        });
    }

    toggleAssistant() {
        const assistant = document.querySelector('.ai-assistant');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            assistant.style.display = 'block';
            document.querySelector('.message-input').focus();
        } else {
            assistant.style.display = 'none';
        }
    }

    closeAssistant() {
        document.querySelector('.ai-assistant').style.display = 'none';
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.querySelector('.message-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Get AI response
        const response = await this.getAIResponse(message);
        
        // Remove typing indicator and add AI response
        this.removeTypingIndicator();
        this.addMessage(response, 'assistant');
    }

    async getAIResponse(message) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${realAI.openAIKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful news assistant. Provide accurate, concise information about current news, trends, and summaries. If you don't know something, be honest about it."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            return "I apologize, but I'm having trouble connecting to the news service right now. Please try again later.";
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.textContent = content;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add to chat history
        this.chatHistory.push({ sender, content, timestamp: new Date() });
    }

    showTypingIndicator() {
        const messagesContainer = document.querySelector('.chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'message assistant-message typing';
        typingElement.id = 'typing-indicator';
        typingElement.textContent = 'AI is thinking...';
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
}

// Initialize AI Assistant
const aiAssistant = new AIAssistant();