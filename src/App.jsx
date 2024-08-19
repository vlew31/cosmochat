import React, { useState } from 'react';
import HomePage from './HomePage';
import ChatPage from './ChatPage';
import './App.css';

function App() {
  const [chatStarted, setChatStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const getChatCountsPerDay = () => {
    const counts = {};
    chatHistory.forEach(chat => {
      const date = new Date(chat.timestamp).toDateString(); // Group by date only
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  };

  const handleStartChat = () => {
    const newChat = {
      id: chatHistory.length,
      messages: [],
      timestamp: new Date().toLocaleString()
    };
    setCurrentChat(newChat);
    setChatStarted(true);
  };

  const handleEndChat = () => {
    // Check if the chat already exists in the history
    const existingChatIndex = chatHistory.findIndex(chat => chat.id === currentChat.id);

    if (existingChatIndex === -1) {
      setChatHistory([...chatHistory, currentChat]); // Add new chat
    } else {
      const updatedHistory = [...chatHistory];
      updatedHistory[existingChatIndex] = currentChat; // Update existing chat
      setChatHistory(updatedHistory);
    }
    
    setChatStarted(false);
    setCurrentChat(null);
  };

  return (
    <div className="App">
      {!chatStarted ? (
        <HomePage 
          onStartChat={handleStartChat} 
          chatHistory={chatHistory} 
          onResumeChat={(chat) => {
            setCurrentChat(chat);
            setChatStarted(true);
          }}
          chatCounts={getChatCountsPerDay()}
        />
      ) : (
        <ChatPage 
          onBackToHome={handleEndChat} 
          currentChat={currentChat} 
          setCurrentChat={setCurrentChat} 
        />
      )}
    </div>
  );
}

export default App;
