import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const [roomName, setRoomName] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim() !== '') {
        history.push(`/chatroom/${roomName}`);
    }
  };

  return (
    <div>
      <h1>Welcome to Chat App</h1>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter chatroom name"
        />
        <button type="submit">Enter Chatroom</button>
      </form>
    </div>
  );
};

export default Home;
