// UNUSED

import React, { useState, useEffect, useContext } from 'react';
import { IconButton } from "@chakra-ui/react";
import { useParams } from 'react-router-dom'
import io from 'socket.io-client';

var socket, selectedChatRoom, chatCompare;

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatRoom, setChatRoom] = useState([]);

  const fetchMessages = async () => {
    const { data } = await axios.get('/api/message/${chatRoom}');

    setMessages(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input) {
      const { data } = await axios.post("/api/message", 
        {
          content: input,
          chatId: chatRoom,
        }
      )
      socket.emit('new message', input);
      setMessages([...messages, input]);
      setInput('');
    }
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL);
    socket.emit("setup", user);
  }, []);

  useEffect(() => {
    fetchMessages();

    chatCompare = selectedChatRoom;
  }, [selectedChatRoom]);

  useEffect(() => {
    socket.on("message recieved", (recievedMessage) => {
      // if chatroom is not selected or doesn't match current
      if (chatCompare || chatCompare.id !== recievedMessage.chat_id) {
        // do nothing
      }
      else {
        setMessages([...messages, recievedMessage]);
      }
      });
  });

  return (
    <div>
      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          type="text"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here"
        />
        <button type="submit">Send</button>
      </form>
      <style jsx>{`
        body {
          margin: 0;
          padding-bottom: 3rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        #form {
          background: rgba(0, 0, 0, 0.15);
          padding: 0.25rem;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          height: 3rem;
          box-sizing: border-box;
          backdrop-filter: blur(10px);
        }
        #input {
          border: none;
          padding: 0 1rem;
          flex-grow: 1;
          border-radius: 2rem;
          margin: 0.25rem;
        }
        #input:focus {
          outline: none;
        }
        #form > button {
          background: #333;
          border: none;
          padding: 0 1rem;
          margin: 0.25rem;
          border-radius: 3px;
          outline: none;
          color: #fff;
        }

        #messages {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        #messages > li {
          padding: 0.5rem 1rem;
        }
        #messages > li:nth-child(odd) {
          background: #efefef;
        }
      `}</style>
    </div>
  );
};

export default ChatRoom;
