// components/Authentication/Signup.js

import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Signup = () => {
  // State variables
  const [show, setShow] = useState(false);                    // State for toggling password visibility
  const [name, setName] = useState();                         // State for name input
  const [email, setEmail] = useState();                       // State for email input
  const [confirmpassword, setConfirmpassword] = useState();   // State for password confirmation input
  const [password, setPassword] = useState();                 // State for password input
  const [pic, setPic] = useState();                           // State for user picture
  const [picLoading, setPicLoading] = useState(false);        // State for picture loading state

  // Hooks
  const toast = useToast();       // Toast notification hook
  const history = useHistory();   // History hook for programmatic navigation

  // Function to handle password visibility toggle
  const handleClick = () => setShow(!show);

  // Function to handle form submission
  const submitHandler = async () => {
    setPicLoading(true);    // Set loading state to true

    // Check if any required fields are empty
    if (!name || !email || !password || !confirmpassword) {
      // Show warning toast
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false); // Reset loading state to false
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmpassword) {
      // Show warning toast
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    
    console.log(name, email, password, pic);
    
    try {
      // Configuration for Axios POST request
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Send signup request to backend
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      console.log(data);

      // Show success toast
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Store user info in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      setPicLoading(false);   // Reset loading state to false

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
      setPicLoading(false); // Reset loading state to false
    }
  };

  // Function to handle picture upload
  const postDetails = (pics) => {
    setPicLoading(true);    // Set loading state to true

    // Check if picture is selected
    if (pics === undefined) {
      // Show warning toast
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    console.log(pics);
    
    // Check if selected file is an image
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      
      // Upload image to cloudinary
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());      // Set uploaded picture URL
          console.log(data.url.toString()); 
          setPicLoading(false);             // Reset loading state to false
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);             // Reset loading state
        });
    } else {
      // Show warning toast if selected file is not an image
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);   // Reset loading state to false
      return;
    }
  };

  return (
    <VStack spacing="5px">
      {/* Name input */}
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      {/* Email input */}
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
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
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Button to toggle password visibility */}
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* Confirm password input */}
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          {/* Button to toggle password visibility */}
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* Picture upload input */}
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;