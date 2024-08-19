// import React, { useState } from 'react';
// import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

// function ChatPage({ onBackToHome }) {
//   const [typing, setTyping] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I am ChatGPT!",
//       sender: "ChatGPT",
//       direction: "incoming"
//     }
//   ]);

//   const handleSend = async (message) => {
//     const newMessage = {
//       message: message,
//       sender: "user",
//       direction: "outgoing"
//     };
//     const newMessages = [...messages, newMessage];

//     setMessages(newMessages);
//     setTyping(true);

//     await processMessageToChatGPT(newMessages);
//   };

//   async function processMessageToChatGPT(chatMessages) {
//     let apiMessages = chatMessages.map((messageObject) => {
//       let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
//       return { role: role, content: messageObject.message };
//     });

//     const systemMessage = {
//       role: "system",
//       content: "Explain all concepts like I am 10 years old."
//     };

//     const apiRequestBody = {
//       "model": "gpt-3.5-turbo",
//       "messages": [
//         systemMessage,
//         ...apiMessages
//       ]
//     };

//     await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     }).then((data) => data.json())
//       .then((data) => {
//         setMessages([...chatMessages, {
//           message: data.choices[0].message.content,
//           sender: "ChatGPT",
//           direction: "incoming"
//         }]);
//         setTyping(false);
//       });
//   }

//   return (
//     <div style={{ position: "relative", height: "800px", width: "700px" }}>
//       <button onClick={onBackToHome} className="back-button">Back to Home</button>
//       <MainContainer>
//         <ChatContainer>
//           <MessageList
//             scrollBehavior="smooth"
//             typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}
//           >
//             {messages.map((message, i) => (
//               <Message key={i} model={message} />
//             ))}
//           </MessageList>
//           <MessageInput placeholder="Type message here" onSend={handleSend} />
//         </ChatContainer>
//       </MainContainer>
//     </div>
//   );
// }

// export default ChatPage;

//code with chat history

import React, { useState, useEffect } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const API_KEY = "sk-proj-vOQd9OFG53iHxPHNp2HcT3BlbkFJenOjifbAe1oX0A7tMcOE";

function ChatPage({ onBackToHome, currentChat, setCurrentChat }) {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(currentChat?.messages || []);

  useEffect(() => {
    setMessages(currentChat?.messages || []);
  }, [currentChat]);

  // Initialize the chat with a welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        message: "Hello, I am ChatGPT!",
        sender: "ChatGPT",
        direction: "incoming"
      };
      setMessages([welcomeMessage]);
      setCurrentChat({ ...currentChat, messages: [welcomeMessage] });
    }
  }, []);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    const updatedChat = { ...currentChat, messages: updatedMessages };
    setCurrentChat(updatedChat);

    setTyping(true);

    await processMessageToChatGPT(updatedMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old."
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const botMessage = {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        };

        const updatedMessages = [...chatMessages, botMessage];
        setMessages(updatedMessages);

        const updatedChat = { ...currentChat, messages: updatedMessages,timestamp: new Date().toLocaleString() };
        setCurrentChat(updatedChat);
        setTyping(false);
      } else {
        console.error("Unexpected response format:", data);
        setTyping(false);
      }
    } catch (error) {
      console.error("Error fetching response from ChatGPT:", error);
      setTyping(false);
    }
  }

  return (
    <div className = "chat-container">
      <div className = "back-button">
        <h1>ChatBot</h1>
      <button onClick={onBackToHome} className="back-button">Back to Home</button>
      </div>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatPage;

