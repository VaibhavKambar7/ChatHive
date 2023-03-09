import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserItemList = ({ user, handlefunction }) => {
  return (
    <Box
      onClick={handlefunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        // background: "rgba(24, 101, 219, 0.9)",
        background: "grey",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        display="flex"
        mr={2}
        mt={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />

      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs" mt={1}>
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserItemList;
