import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage, ChatSession } from '../types';
import { addChatSession, addChatMessage, updateChatSession } from '../services/dbService';
import { db } from '../services/firebase';

interface LiveChatWidgetProps {
  user: User | null;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalloutVisible, setIsCalloutVisible] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for live chat
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('chatSessionId'));
  const [userName, setUserName] = useState(localStorage.getItem('chatUserName') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('chatUserEmail') || '');

  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // If user is logged in, pre-fill their details
  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
    }
  }, [user]);

  // Effect to listen for new messages
  useEffect(() => {
    if (!sessionId) return;
    
    setSessionStarted(true);
    
    const unsubscribe = db.collection('chat_sessions').doc(sessionId).collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const newMessages: ChatMessage[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(newMessages);
      });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      alert("Please enter your name and email.");
      return;
    }
    
    setIsLoading(true);
    try {
      // FIX: Conditionally build the session payload to avoid sending 'userId: undefined' to Firestore
      // when a user is not logged in. Firestore does not support 'undefined' values.
      const sessionPayload: Omit<ChatSession, 'id'> = {
        userName,
        userEmail,
        status: 'open',
        createdAt: new Date(),
        lastMessage: 'Session started.',
        unreadByAgent: true,
      };

      if (user) {
        sessionPayload.userId = user.id;
      }
      
      const createdSession = await addChatSession(sessionPayload);
      
      setSessionId(createdSession.id);
      localStorage.setItem('chatSessionId', createdSession.id);
      localStorage.setItem('chatUserName', userName);
      localStorage.setItem('chatUserEmail', userEmail);
      setSessionStarted(true);
      
    } catch (error) {
      console.error("Error starting chat session:", error);
      alert("Could not start chat. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !sessionId) return;
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const messageData: Omit<ChatMessage, 'id'> = {
            text: currentInput,
            sender: 'user',
            timestamp: new Date()
        };
        await addChatMessage(sessionId, messageData);
        // Also update the session document for the admin preview
        await updateChatSession(sessionId, {
            lastMessage: currentInput,
            unreadByAgent: true,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        // Optionally put the message back in the input
        setInput(currentInput);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const renderChatContent = () => {
    if (!sessionStarted) {
      return (
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Welcome!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please fill in your details to start chatting with an agent.</p>
          <form onSubmit={startSession} className="space-y-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-gray-100 dark:bg-[#111] border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-byd-red"
              required
            />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full bg-gray-100 dark:bg-[#111] border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-byd-red"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-byd-red text-white py-2 px-5 rounded-md hover:bg-byd-red-dark disabled:bg-red-900/50 transition-colors"
            >
              {isLoading ? 'Starting...' : 'Start Chat'}
            </button>
          </form>
        </div>
      );
    }
    
    return (
      <>
        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-black">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-byd-red text-white' : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-[#d9d9d9]'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
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
              placeholder="Type your message..."
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
      </>
    );
  };

  return (
    <>
      {/* Floating Action Button and Callout */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'} flex items-end gap-3`}>
        {/* Black label/callout */}
        {isCalloutVisible && (
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in-up">
            <span className="font-semibold whitespace-nowrap">Chat with an Agent</span>
            <button onClick={() => setIsCalloutVisible(false)} className="text-gray-400 hover:text-white" aria-label="Dismiss chat suggestion">
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
          aria-label="Open Live Chat"
        >
          <i className="bi bi-chat-dots-fill text-2xl"></i>
        </button>
      </div>

      <div className={`fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full h-full sm:w-96 sm:h-[600px] bg-white dark:bg-black rounded-t-lg sm:rounded-lg shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} font-medium`} role="dialog" aria-modal="true" aria-hidden={!isOpen} aria-labelledby="live-chat-header">
        {/* Header */}
        <div className="bg-white dark:bg-black text-black dark:text-white p-4 flex justify-between items-center rounded-t-lg sm:rounded-t-lg border-b border-gray-200 dark:border-gray-800">
          <h3 id="live-chat-header" className="font-bold text-lg">Chat with Agent</h3>
          <button onClick={() => setIsOpen(false)} className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close chat">
            <i className="bi bi-x-lg text-2xl"></i>
          </button>
        </div>
        
        {renderChatContent()}

      </div>
    </>
  );
};

export default LiveChatWidget;