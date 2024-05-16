import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'
import io from 'socket.io-client';

let socket = io(process.env.REACT_APP_API_URL);

const ChatRoom = () => {
  //const { roomName } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {

    const fetchDetails = async () => {
      // Fetch details from your backend if needed
    };

    fetchDetails();

    socket.on('connect', () => {
      socket.emit('join', 'mongodb');
    });

    socket.on('joined', async (roomId) => {
      const result = await fetch(`${process.env.REACT_APP_API_URL}/chats?room=${roomId}`)
        .then(response => response.json());
      setMessages(result.messages);
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('new message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('connect');
      socket.off('joined');
      socket.off('new message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      socket.emit('new message', input);
      setInput('');
    }
  };

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
