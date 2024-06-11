// components/Authentication/Login.js

import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  // State variables
  const [show, setShow] = useState(false);          // State for toggling password visibility
  const [email, setEmail] = useState();             // State for email input
  const [password, setPassword] = useState();       // State for password input
  const [loading, setLoading] = useState(false);    // State for loading state

  // Hooks
  const toast = useToast();         // Toast notification hook
  const history = useHistory();     // History hook for programmatic navigation
  const { setUser } = ChatState();  // Custom context hook

  // Function to handle password visibility toggle
  const handleClick = () => setShow(!show);

  // Function to handle form submission
  const submitHandler = async () => {
    setLoading(true);     // Set loading state to true
    
    // Check if email or password is empty
    if (!email || !password) {
      // Show warning toast
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);  // Reset loading state to false
      return;
    }

    try {
      // Configuration for Axios POST request
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Send login request to backend
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // Show success toast
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Set user in context
      setUser(data);

      // Store user info in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Reset loading state
      setLoading(false);

      // Redirect to chats page
      history.push("/chats");
    } catch (error) {
      // Show error toast
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);    // Reset loading state to false
    }
  };

  return (
    <VStack spacing="10px">
      {/* Email input */}
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      {/* Password input */}
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          {/* Button to toggle password visibility */}
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* Login button */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      {/* Button to get guest user credentials */}
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;