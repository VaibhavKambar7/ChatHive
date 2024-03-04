import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { Divider } from "@chakra-ui/react";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  renderSettings: {
    preserverAspectRatio: "xMidYMid slice",
  },
};

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const chatContainerRef = useRef(null);

  const fetchMessages = async () => {
    if (!selectedChat) return;

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
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (userId) => setIsTyping(userId !== user._id)); 
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (!newMessage) return;

    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the messages",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timeLength = 2000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "20px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            fontWeight="bold"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color="white"
          >
            <IconButton
              color="white"
              background="black"
              _hover={{ backgroundColor: "#0B141A" }}
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {/* Typing animation (Lottie) */}
                {isTyping && (
                  <div style={{ marginRight: "10px", marginTop: "4px" }}>
                    <Lottie
                      options={defaultOptions}
                      width={50}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                )}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {/* Typing animation (Lottie) */}
                {isTyping && (
                  <div style={{ marginRight: "10px" }}>
                    <Lottie
                      options={defaultOptions}
                      width={50}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                )}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          {/* <div style={{ color: "white" }}>hi</div> */}

          <Divider borderColor="gray.700" />

          <Box
            d="flex"
            flexDir="column"
            justifyContent="space-between"
            position="relative"
            p={3}
            bg="#202C33"
            w="100%"
            h="calc(100% - 60px)"
            borderRadius="lg"
            overflowY="scroll"
            ref={chatContainerRef}
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
          </Box>

          <Box
            position="sticky"
            bottom="3"
            width="100%"
            height="10%"
            backgroundColor="#0B141A"
          >
            <FormControl onKeyDown={sendMessage} isRequired>
              <Input
                variant="filled"
                bg="#2A3942"
                placeholder="Type a message..."
                onChange={typingHandler}
                value={newMessage}
                borderWidth="2px"
                borderRadius="2px"
                color="white"
                background="none"
                _hover={{ backgroundColor: "#0B141A" }}
                focusBorderColor="#no"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans" color={"white"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
