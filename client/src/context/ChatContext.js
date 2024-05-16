import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Create the context
const chatContext = createContext();

// Provider component to wrap the app with
const chatProvider = ({ children }) => {
    const [messages, setMessages] = useState('');
    const [room, setroom] = useState();
    const history = useHistory();

    useEffect(() => {
        const chatName = JSON.parse(localStorage.getItem("chatName"));
        setroom(chatName);

        if (!chatName) history.push("/");
    }, [history]);

    return (
        <chatContext.Provider 
        value={{ 
            room, 
            setroom,
            messages,
            setMessages,  
          }}
        >
            {children}
        </chatContext.Provider>
    );
};

export const chatState = () => {
    return useContext(chatContext);
};

export default chatProvider();
