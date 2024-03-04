import React, { useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" marginBottom="20px" centerContent>
      {/* <Box
        className="box"
        display="flex"
        justifyContent="center"
        p={4} // padding
        bg="black"
        w="90%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"

      > */}
      {/* <Text
          fontSize="4xl"
          fontFamily="Work Sans"
          fontWeight="bold"
          color="black"
        >
          Chat-App
        </Text> */}
      {/* <Text fontSize="2xl" fontFamily="Helvetica" fontWeight="bold">
          ChatHive
        </Text>
      </Box> */}

      <Box
        bg="white"
        w="80%"
        // h="70%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        marginTop="70px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign-Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
