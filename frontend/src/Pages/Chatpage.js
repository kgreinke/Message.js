import React, { useEffect, useState } from 'react';
import axios from "axios";

const Chatpage = () => {
const [chats, setChats] = useState([])

    //Chat data
    const fetchChats = async () => {
        //This is the call to where the data is
        //const {data} = await axios.get('/api/chat');

        //setChats(data);
    };

    useEffect(() => {
        //to go get the chats
        fetchChats();
    }, [])

  return (
    <div> 
        {chats.map((chat) => (
            //making the key the id of the caht
            <div>key ={chat.id}{chat.chat} </div>
    ))}
    </div>
  );
};

export default Chatpage
