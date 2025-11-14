import React, { useState, useRef, useEffect } from 'react';
import { askBYDAssistant } from '../services/geminiService';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalloutVisible, setIsCalloutVisible] = useState(true); // New state for the label
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveChatToDatabase = async (question: string, answer: string) => {
    console.log("Saving chat to database (simulated):", {
      question,
      answer,
      timestamp: new Date().toISOString(),
    });
  };
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const currentInput = input;
    const userMessage: Message = { role: 'user', text: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    
    const responseText = await askBYDAssistant(history, currentInput);
    
    const modelMessage: Message = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);

    await saveChatToDatabase(currentInput, responseText);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button and Callout */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'} flex items-end gap-3`}>
        {/* Black label/callout */}
        {isCalloutVisible && (
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in-up">
            <span className="font-semibold whitespace-nowrap">Ask BYD AI</span>
            <button onClick={() => setIsCalloutVisible(false)} className="text-gray-400 hover:text-white" aria-label="Dismiss AI suggestion">
              <i className="bi bi-x"></i>
            </button>
          </div>
        )}
        {/* Red button */}
        <button
          onClick={() => {
            setIsOpen(true);
            setIsCalloutVisible(false); // Hide callout when chat opens
          }}
          className="bg-byd-red text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-byd-red-dark transition-colors shrink-0"
          aria-label="Open AI Assistant"
        >
          <i className="bi bi-chat-quote-fill text-2xl"></i>
        </button>
      </div>

      <div className={`fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full h-full sm:w-96 sm:h-[600px] bg-white dark:bg-black rounded-t-lg sm:rounded-lg shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} font-medium`} role="dialog" aria-modal="true" aria-hidden={!isOpen} aria-labelledby="ai-assistant-header">
        {/* Header */}
        <div className="bg-white dark:bg-black text-black dark:text-white p-4 flex justify-between items-center rounded-t-lg sm:rounded-t-lg border-b border-gray-200 dark:border-gray-800">
          <h3 id="ai-assistant-header" className="font-bold text-lg">Ask BYD AI</h3>
          <button onClick={() => setIsOpen(false)} className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close chat">
            <i className="bi bi-x-lg text-2xl"></i>
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-black">
          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-byd-red text-white' : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-[#d9d9d9]'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start mb-4">
               <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200" aria-label="AI is typing">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                 </div>
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded-b-lg sm:rounded-b-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about our cars..."
              className="flex-1 bg-gray-100 dark:bg-[#111] border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-byd-red focus:border-byd-red placeholder:text-gray-500 dark:placeholder:text-[#888888]"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-byd-red text-white py-2 px-5 rounded-r-full hover:bg-byd-red-dark disabled:bg-red-900/50 transition-all duration-300 hover:shadow-[0_0_12px_rgba(217,0,27,0.7)]"
              aria-label="Send message"
            >
              <i className="bi bi-send-fill text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;