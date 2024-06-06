import "./styles.css"
import axios from "axios";
import { FormControl, Input, Box, Text, IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import { ChatState } from "../Context/ChatProvider";
import animationData from "../animations/typing.json";
import { Player } from '@lottiefiles/react-lottie-player';
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/updateGroupChat";

// Use this for local hosting, just make sure to swap what is used in server.js.
//const ENDPOINT = "http://localhost:3000";
// Use this for render deployment
const ENDPOINT = "https://message-js.onrender.com/";

var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages,setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

    useEffect( () => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));

      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
      // eslint-disable-next-line
    }, []);    

    const fetchMessages = async () => {
      if (!selectedChat)
        return;

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },  
          };

          setLoading(true);

          const { data } = await axios.get(
            `/api/message/${selectedChat._id}`,
            config
          );
          setMessages(data);
          setLoading(false)

          socket.emit("join chatroom", selectedChat._id);

        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to fetch chatroom messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
    };


    const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage){
        socket.emit("stop typing", selectedChat._id);
        
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };

          const { data } = await axios.post(
            '/api/message/',
              {
                content: newMessage,
                chatId: selectedChat._id,
              },
              config
          );
          
          setNewMessage("");
          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to fetch send messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    };

    useEffect( () => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (!selectedChatCompare ||selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          //setNotification([newMessageRecieved, ...notification]);
          //setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

    const typingHandler = (event) => {
        setNewMessage(event.target.value);

        if(!socketConnected)
            return;

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout( () => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{base: "28px", md: "30px"}}
            pb={3}
            px={2}
            w="100%"
            fontFamily="sans-serif"
            display="flex" 
            justifyContent={{base: "space-between"}}
            alignItems="center"
            //border="1px solid red" // Add a border to visualize the boundaries of the Text component

          >
            <IconButton
              display={{base: "flex"}}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ?(
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />   
                </>
            ):(
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
            ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="x1"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Player 
                    src="https://lottie.host/12b5eb8b-8a4c-4f70-b019-f94bb22d6f3c/1pQkiGvKa2.json" 
                    className="player" 
                    speed={1} 
                    style={{ height: "40px", width: "70px" }} 
                    loop 
                    autoplay
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E1"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="65" pb={3} fontFamily="work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;