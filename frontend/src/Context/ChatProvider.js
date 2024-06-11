// context/ChatProvider.js

import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// Create a context for managing chat-related state
const ChatContext = createContext();

// ChatProvider component manages the chat-related state
const ChatProvider = ({ children }) => {
  // State variables for selected chat, user, notifications, and chats
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const history = useHistory();

  // Load user information from local storage when component mounts
  useEffect(() => {
    // Retrieve user information from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // Set user state
    setUser(userInfo);

    // Redirect to login page if user information is not found
    if (!userInfo)  history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for accessing chat-related state
export const ChatState = () => {
  return useContext(ChatContext);
};

// Export the ChatProvider component as default
export default ChatProvider;