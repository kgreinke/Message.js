# Message.js

## Table of Contents
- [Overview of our project](#overview)
- [Key Features available in this app](#key-features)
- [Technology utilized](#technological-backbone)
- [Instillation Guide](#instalation)
- [Postman Testing](#postman-testing)
- [Contributions](#made-by)

## Overview
Message.js is an innovative, real-time communication platform designed to enhance the way individuals and teams connect and collaborate. Built using the powerful MERN Stack framework (MongoDB, Express, React, Node.js) and leveraging Socket.io for seamless, low-latency interactions, Message.js offers a robust and scalable solution for modern communication needs. Whether for personal use or organizational deployment, Message.js provides an intuitive, secure, and feature-rich environment for engaging conversations.

### Key Features
- **Authentication**
   - **_User Registration:_** Simple and secure sign-up process to onboard new users.
   - **_Login/Logout:_** Efficient and secure authentication mechanisms to ensure user data protection and integrity.

- **Creating New Chat Rooms**
   - **_Individual and Group Chats:_** Effortlessly create new chat rooms with one or multiple users, facilitating both personal and team communication.
   - **_User Invitations:_** Seamlessly invite existing users to join new chat rooms, enhancing collaboration.

- **Real-Time Messaging**
   - **_Instant Communication:_** Leverage Socket.io for real-time messaging, ensuring low latency and high responsiveness.
   - **_Rich Text Support:_** Enable expressive conversations with support for rich text formatting.

- **Conversation History**
   - **_Persistent Storage:_** Store all messages securely in a MongoDB database, ensuring data persistence and accessibility.
   - **_Message Retrieval:_** Easily access and review past conversations to keep track of important information and decisions.

- **Chat Room Management**
   - **_List of Chat Rooms:_** Display all created chat rooms in a user-friendly interface, allowing users to quickly navigate between different conversations.
   - **_Deleting Chat Rooms:_** Provide users with the ability to delete chat rooms, ensuring that obsolete or irrelevant conversations do not clutter the interface.

- **Secure Database Management**
   - **_User Data Protection:_** Implement robust security measures to safeguard users' private information and contact lists.
   - **_Messaging History:_** Ensure that all messaging history is securely stored and easily retrievable, providing users with confidence in the reliability of the platform.

### Technological Backbone
- **MongoDB:** A flexible, document-oriented database that ensures efficient storage and retrieval of user data and messaging history.
- **Express:** A powerful web application framework for Node.js, providing a robust set of features for building web and mobile applications.
- **React:** A leading frontend library for building dynamic and responsive user interfaces, ensuring a seamless user experience.
- **Node.js:** A versatile and efficient runtime environment that powers the server-side logic of Message.js, facilitating real-time capabilities.
- **Socket.io:** A library that enables real-time, bidirectional, and event-based communication, ensuring that messages are delivered instantaneously.

## Instalation
1. Clone our repository:
    ```bash
    git clone https://github.com/kgreinke/Message.js.git
    cd Message.js
    ```

2. Installing Dependencies:
   - Frontend:
   ```bash
   cd frontend
   npm install
   ```
   - Backend:
   ```bash
   cd ..
   cd backend
   npm install
   ```
> [!NOTE]
> After the frontend modules are installed, it will say that there are vulnerabilities, you can ignore this.

3. Start up
   In seperate terminals from repository root directory:
   - Backend:
   ```bash
   cd backend
   npm start
   ```
   - Frontend:
   ```bash
   cd frontend
   npm start
   ```

4. Open your preferred browser and navigate to http://localhost:3000
> [!TIP]
> If you are running this in VS Code, your default browser will automatically open to the site.

## Deployment Server
https://message-js.onrender.com/

## Postman Testing

- New User Post
  <img src="Postman_testing/Screenshot 2024-06-10 162944.png" alt="User Post Request">

- User Login Request
  <img src="Postman_testing/Screenshot 2024-06-10 162954.png" alt="User Login Request">

- Search User Request
  <img src="Postman_testing/Screenshot 2024-06-10 163001.png" alt="User Login Request">

- New One-To-One Chat Post
  <img src="Postman_testing/Screenshot 2024-06-10 163006.png" alt="User Post Request">

- Get Chat Request
  <img src="Postman_testing/Screenshot 2024-06-10 163013.png" alt="User Login Request">

- New Group Chat Post
  <img src="Postman_testing/Screenshot 2024-06-10 163021.png" alt="User Post Request">

- Rename Group Chat Request
  <img src="Postman_testing/Screenshot 2024-06-10 163031.png" alt="User Post Request">

- Add To Group Request
  <img src="Postman_testing/Screenshot 2024-06-10 163038.png" alt="User Login Request">

- Remove From Group Request
  <img src="Postman_testing/Screenshot 2024-06-10 163044.png" alt="User Post Request">

- New Message Post
  <img src="Postman_testing/Screenshot 2024-06-10 163049.png" alt="User Login Request">

- Get All Messages By Chat
  <img src="Postman_testing/Screenshot 2024-06-10 163055.png" alt="User Post Request">


## Made By
@kgreinke and @francoer