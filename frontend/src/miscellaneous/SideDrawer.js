import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  HStack,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../components/ChatLoading";
import { useToast } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
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

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(data);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#202C33"
        w="100%"
        p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users   to Chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            bg={"#202124"}
            color="white"
            _hover={{ backgroundColor: "#0B141A" }}
          >
            <i class="fa fa-search" aria-hidden="true"></i>
            <Text
              display={{ base: "none ", md: "flex" }}
              px="4"
              color="white"
              _hover={{ backgroundColor: "#0B141A" }}
            >
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="2xl"
          fontFamily="Helvetica "
          fontWeight="bold"
          color="white"
        >
          {/* ChatHive */}
        </Text>
        <div>
          <Menu>
            <MenuButton p="1">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" color="#0f1411" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                background={"#202124"}            
                      key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="#161f1a"
              _hover={{ backgroundColor: "black" }}
              color={"grey"}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList color={"white"} background={"#202124"}>
              <ProfileModal
                user={user}
                color="#78997A"
                _hover={{ backgroundColor: "#0B141A" }}
              >
                <MenuItem color={"white"} background={"#202124"}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                color={"white"}
                background={"#202124"}
                onClick={logoutHandler}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent borderWidth="1px">
          <DrawerHeader
            borderBottomWidth="1px"
            backgroundColor="#0B141A"
            color="white"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody backgroundColor="#0B141A">
            <Box display="flex" pb={2} backgroundColor="#0B141A">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                color="white"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <HStack
                  key={user._id}
                  onClick={() => accessChat(user._id)}
                  p={2}
                  _hover={{ bg: "gray.200", cursor: "pointer" }}
                  borderRadius="6px"
                >
                  <Avatar size="sm" name={user.name} src={user.pic} />
                  <Box>
                    <Text fontWeight="bold">{user.name}</Text>
                    <Text fontSize="sm">{user.email}</Text>
                  </Box>
                </HStack>
              ))
            )}
            {/* //   searchResult?.map((user) => (
          //     <UserListItem */}
            {/* //       key={user._id}
          //       user={user}
          //       onClick={() => accessChat(user._id)}
          //     />
          //   ))
          // )} */}
            {/* {loadingChat && <Text>hello</Text>} */}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
