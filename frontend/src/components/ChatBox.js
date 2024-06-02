import "./styles.css";

import React from 'react'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import { ChatState } from '../Context/ChatProvider';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      justifyContent="flex-end" 
      flexDir="column"
      p={3}
      bg="White"
      w={{base: "100%", md: "66%"}}
      borderRadius="lg"
      borderWidth="1px"
      height="89.5%" 
      position="fixed" 
      right="15" 
      top="69" 

    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  );
};

export default ChatBox; 
