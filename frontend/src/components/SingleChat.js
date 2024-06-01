import "./styles.css"
import axios from "axios";
import { FormControl, Input, Box, Text, IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import { ChatState } from "../Context/ChatProvider";
import animationData from "./miscellaneous/typing.json";
import Lottie from "lottie-react";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
};

const SingleChat = () => {
    const [messages,setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();
    
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
            socket.emit("stopped typing", selectedChat._id);
        
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        text: newMessage,
                      roomId: selectedChat,
                    },
                    config
                  );

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
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stopped typing", () => setIsTyping(false));
        // eslint-disable-next-line
    }, []);

    useEffect( () => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, []);

    useEffect( () => {
        socket.on("message recieved", (recievedMessage) => {
            if(!selectedChatCompare || selectedChatCompare._id !== recievedMessage.roomId._id) {
                setMessages([...messages, recievedMessage]);
            }
        });
    });

    const typingHandler = (event) => {
        setNewMessage(event.target.value);

        if(!socketConnected)
            return;

        if(!isTyping){
            setIsTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let timeout = new Date().getTime();
        var timer = 3000;
        setTimeout( () => {
            var now = new Date().getTime();
            var diff = now - timeout;

            if (diff >= timer && isTyping){
                socket.emit("stopped typing", selectedChat._id);
                setIsTyping(false);
            }
        }, timer);
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
            d="flex"
            justifyContent={{base: "space-between"}}
            alignItems="center"
          >
            <IconButton
              d={{base: "flex", md: "none"}}
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
                <></>
            ))}
          </Text>
          <Box
            d="flex"
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
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{marginBottom: 15, marginLeft: 0}}
                  />
                </div>
              ): (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E1"
                placeholder="Start Typing..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box 
          d="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
            <Text
              fontSize="3x1"
              pb={3}
              fontFamily="sans-serif"
            >
                Click on a user to start chatting
            </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;