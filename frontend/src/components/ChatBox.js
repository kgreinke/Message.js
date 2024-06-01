import "./styles.css";

import React from 'react'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import { ChatState } from '../Context/ChatProvider';

const ChatBox = () => {
  const { selectedChat } = ChatState();
  
  return (
    <Box
      d={{base: selectedChat ? "flex" : "none", md: "flex"}}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="grey"
      w={{base: "100%", md: "69%"}}
      borderRadius="1g"
      borderWidth="1px"
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox; 
