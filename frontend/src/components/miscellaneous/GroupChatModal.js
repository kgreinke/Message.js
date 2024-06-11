// components/miscellaneous/GroupChatModal.js

import { Button, FormControl, Input, useDisclosure, useToast, Box} from '@chakra-ui/react'
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
  // Disclosure hook for modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // State variables
  const [groupChatName, setGroupChatName] = useState();     // State for group chat name input
  const [selectedUsers, setSelectedUsers] = useState([]);   // State for selected users
  const [search, setSearch] = useState("");                 // State for search input
  const [searchResult, setSearchResult] = useState([]);     // State for search results
  const [loading, setLoading] = useState(false);            // State for loading state
    
  // Toast hook for notifications
  const toast = useToast();

  // ChatState context for user and chats data
  const { user, chats, setChats } = ChatState();

  // Function to handle user search
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  
    // Function to handle form submission
    const handleSubmit = async() => {
      if(!groupChatName || !selectedUsers){
        toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
      }
        try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post("/api/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      },
    config
    );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
        } catch(error){
        toast({
        title: "Failed to Create the Chat!",
        description: error.resonse.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
        }
    };

    // Function to handle user deletion from selected users
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };


    // Function to handle adding user to selected users
    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      {/* Group chat modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat</ModalHeader>
          <ModalCloseButton />
          {/* Modal body */}
          <ModalBody display="flex" flexDir="column" alignItems="center"> 
            {/* Form control for chat name */}
            <FormControl>
                <Input 
                placeholder='Chat Name' 
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                />
            </FormControl>
            {/* Form control for adding users */}
            <FormControl>
                <Input 
                placeholder='Add Users eg: Erick, Kat, John' 
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                />
            </FormControl>

          {/* Box to display selected users */}
          <Box w="100%" display="flex" flexWrap="wrap">
            {selectedUsers.map(u => (
                <UserBadgeItem key={user._id} user={u}
                handleFunction={() => handleDelete(u)}
                />
            ))}
        </Box>
            {loading ? (
                <div>loading</div>
            ) : (
                searchResult
                ?.slice(0,4)
                .map((user) => (
                    <UserListItem 
                    key={user._id} 
                    user={user} 
                    handleFunction={()=>handleGroup(user)}
                    />
                    ))
                )}
          </ModalBody>
          {/* Modal footer with leave group button */}
          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
