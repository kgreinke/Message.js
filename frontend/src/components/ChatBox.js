import "./styles.css";

import React from 'react'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import { ChatState } from '../Context/ChatProvider';

const ChatBox = () => {
  const { selectedChat } = ChatState();
  
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      justifyContent="flex-end" 
      flexDir="column"
      p={3}
      bg="grey"
      w={{ base: "75%", md: "62%" }}
      borderRadius="lg"
      borderWidth="1px"
      height="89%" 
      position="fixed" 
      right="50" 
      top="69" 
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox; 
