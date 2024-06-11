// components/miscellaneous/SideDrawer.js

import { Box, Text} from "@chakra-ui/layout"
import { 
  Drawer, 
  DrawerBody, 
  DrawerContent, 
  DrawerHeader, 
  DrawerOverlay, 
  Input, 
  Menu, 
  MenuButton, 
  MenuDivider, 
  MenuItem, 
  MenuList, 
  Spinner, 
  Tooltip, 
  useDisclosure, 
  useToast } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from 'react';
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom"
import axios from "axios";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../UserAvatar/UserListItem";


const SideDrawer = () => {
  // State variables
  const [search, setSearch] = useState("")              // State for search input
  const [searchResult, setSearchResult] = useState([])  // State for search results
  const [loading, setLoading] = useState(false)         // State for loading state during search
  const [loadingChat, setLoadingChat] = useState()      // State for loading state during chat access
  
  // Chat state
  const { user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
  
  // Hooks
  const history = useHistory();                         // History hook for programmatic navigation
  const { isOpen, onOpen, onClose } = useDisclosure();  // Disclosure hook for drawer
  const toast = useToast();                             // Toast notification hook

  // Function to handle logout
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  // Function to handle search
  const handleSearch = async () => {
    // Show warning toast if search query is empty
    if(!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        postion: "top-left",
      });
      return;
    };

    try{
      setLoading(true);   // Set loading state to true

      // Configuration for Axios GET request
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get(`/api/user?search=${search}`, config)

      setLoading(false);      // Reset loading state to false
      setSearchResult(data);  // Set search results
    } catch (error) {
      // Show error toast if search fails 
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        postion: "bottom-left",
      });

    }

  };

    // Function to access chat with a user  
    const accessChat = async (userId) => {
      try{
        setLoadingChat(true)  // Set loading state to true

        // Configuration for Axios POST request
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        // Send chat access request to backend
        const {data} = await axios.post("/api/chat", { userId }, config);

        // Update chats state
        if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        
        setSelectedChat(data);    // Set selected chat
        setLoadingChat(false);    // Reset loading state to false
        onClose();                // Close the drawer
      } catch(error){
        // Show error toast if chat access fails
        toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        postion: "bottom-left",
      });

      }
    };

  return (
    <>
      <Box
        display = "flex"
        justifyContent="space-between"
        alignItems = "center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
          {/* Button to open search drawer */}
          <Tooltip
            label="Search Users to chat" hasArrow placement='bottom-end'>
              <Button variant= "ghost" onClick={onOpen}>
                <i class="fas fa-search"></i>
                <Text d={{ base: "none", md: "flex" }} px ={4}>
                  Search User 
                </Text>
              </Button>
          </Tooltip>
          <Text fontSize="2x1" font Family="Word sans">
            Message.js
          </Text>
          {/* User menu */}
          <div>
            <Menu>
              <MenuButton p={1}>
               <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
               />
                <BellIcon fontSize="2xl" m={1} />
              </MenuButton>
              <MenuList pl={2}>
                {/* Display notifications */}
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {/* Display new message notifications */}
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
              ))}
            </MenuList>
            </Menu>
              {/* User profile menu */}
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                  <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                  {/* Menu item to view user profile */}
                  <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>{" "}
                  </ProfileModal>
                    <MenuDivider />
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
              </Menu>
          </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px"> Search Users</DrawerHeader>   
            <DrawerBody>
            <Box display="flex" pb={2}> 
              <Input              
               placeholder="Search by name or email"
               mr={2}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
              />
            <Button 
            onClick={handleSearch}> Go </Button>
            </Box>
            {loading ? <ChatLoading/> :  
            (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
         </DrawerContent>
      </Drawer>

    </>
  );
};

export default SideDrawer;
