import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, ChatMessage, User } from '../../types';
import { db, auth } from '../../services/firebase';
import { updateChatSession, addChatMessage } from '../../services/dbService';

const LiveChatTab: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [adminMessage, setAdminMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'open' | 'closed'>('open');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A simple way to get the current admin's name. In a real app, this would be more robust.
    const admin = auth.currentUser;
    if (admin) {
        setCurrentUser({ name: admin.displayName || "Admin", email: admin.email!, id: admin.uid, balance: 0 });
    }

    const unsubscribe = db.collection('chat_sessions')
      .where('status', '==', filter)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedSessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
        setSessions(fetchedSessions);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, [filter]);

  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      return;
    }

    const unsubscribe = db.collection('chat_sessions').doc(selectedSession.id).collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(newMessages);
      });

    // Mark messages as read by agent when a session is opened
    if (selectedSession.unreadByAgent) {
        updateChatSession(selectedSession.id, { unreadByAgent: false });
    }

    return () => unsubscribe();
  }, [selectedSession]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
  };

  const handleSendMessage = async () => {
    if (!adminMessage.trim() || !selectedSession || !currentUser) return;
    
    const messageData: Omit<ChatMessage, 'id'> = {
      text: adminMessage,
      sender: 'agent',
      timestamp: new Date(),
    };
    
    await addChatMessage(selectedSession.id, messageData);
    await updateChatSession(selectedSession.id, { 
        lastMessage: adminMessage,
        agentId: currentUser.id,
        agentName: currentUser.name,
    });
    
    setAdminMessage('');
  };

  const handleCloseSession = async () => {
    if (!selectedSession || !window.confirm("Are you sure you want to close this chat session?")) return;
    
    await updateChatSession(selectedSession.id, { status: 'closed' });
    setSelectedSession(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-[75vh] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Session List */}
      <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-black dark:text-white">Chat Sessions</h3>
          <div className="flex mt-2 rounded-md shadow-sm">
            <button onClick={() => setFilter('open')} className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${filter === 'open' ? 'bg-byd-red text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>Open</button>
            <button onClick={() => setFilter('closed')} className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${filter === 'closed' ? 'bg-byd-red text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>Closed</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-gray-500">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="p-4 text-gray-500">No {filter} sessions.</p>
          ) : (
            sessions.map(session => (
              <button key={session.id} onClick={() => handleSelectSession(session)} className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedSession?.id === session.id ? 'bg-byd-red/10' : ''}`}>
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-black dark:text-white">{session.userName}</p>
                    {session.unreadByAgent && <span className="w-3 h-3 bg-byd-red rounded-full"></span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.lastMessage}</p>
              </button>
            ))
          )}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="w-full md:w-2/3 flex flex-col">
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-black dark:text-white">{selectedSession.userName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSession.userEmail}</p>
              </div>
              {filter === 'open' && (
                <button onClick={handleCloseSession} className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">Close Session</button>
              )}
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className={`flex mb-4 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'agent' ? 'bg-byd-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            {filter === 'open' && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <input
                    type="text"
                    value={adminMessage}
                    onChange={e => setAdminMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-byd-red"
                    />
                    <button onClick={handleSendMessage} className="bg-byd-red text-white py-2 px-5 rounded-r-full hover:bg-byd-red-dark transition-colors">
                        <i className="bi bi-send-fill text-xl"></i>
                    </button>
                </div>
                </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500">
            <div>
              <ion-icon name="chatbubbles-outline" class="text-6xl mb-2"></ion-icon>
              <p>Select a session to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatTab;
