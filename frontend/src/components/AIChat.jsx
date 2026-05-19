import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api';
import './AIChat.css';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your SmartCart AI Assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newHistory = [...messages, { text: userMsg, isUser: true }];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const conversationToSend = newHistory.filter(msg => !msg.isError);
      const response = await sendChatMessage(conversationToSend);
      setMessages(prev => [...prev, { text: response.reply, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to my brain right now.", isUser: false, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-chat-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="ai-chat-toggle" onClick={() => setIsOpen(true)}>
          <span className="ai-icon">✨</span>
          <span className="tooltip-text">Ask AI</span>
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-window animate-fade-in">
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <span className="ai-icon-small">✨</span>
              <h3>SmartCart AI</h3>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.isUser ? 'user' : 'ai'}`}>
                <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper ai">
                <div className="message-bubble loading">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai-chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, orders..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="send-btn">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;
