import { AddIcon } from "@chakra-ui/icons";
import {
  useToast,
  Text,
  Box,
  Button,
  Stack,
  Spacer,
  Flex,
  Heading,
  ButtonGroup,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "../miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#202C33"
      w={{ base: "100%", md: "31%" }}
      borderRadius="1px"
      borderWidth="1px"
      borderColor="gray.600"
    >
      <Flex
        minWidth="max-content"
        alignItems="center"
        gap="2"
        marginBottom="20px"
      >
        <Box
          pb={1}
          px={4}
          fontFamily="Gotham, sans-serif"
          w="100%"
          ontSize={{ base: "28px", md: "30px" }}
          color={"white"}
        >
          <Heading size="md" fontSize="2xl">
            My Chats
          </Heading>
        </Box>
        <GroupChatModal color={"#202124"}>
          <Button
            display="flex"
            fontSize={{ base: "14px", md: "10px", lg: "15px" }}
            rightIcon={<AddIcon color={"white"} />}
            bg={"#202124"}
            textColor={"white"}
            _hover={{ backgroundColor: "#0B141A" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#2A3942"
        w="100%"
        h="88%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#202124" : "#202C33"}
                // color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text color={"white"}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs" color={"#86897A"}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
