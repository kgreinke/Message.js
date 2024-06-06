# Message.js

## Table of Contents
- [Overview of our project](#overview)
- [Key Features available in this app](#key-features)
- [Technology utilized](#technological-backbone)
- [Instillation Guide](#instalation)
- [Contributions](#made-by)

## Overview
Message.js is an innovative, real-time communication platform designed to enhance the way individuals and teams connect and collaborate. Built using the powerful MERN Stack framework (MongoDB, Express, React, Node.js) and leveraging Socket.io for seamless, low-latency interactions, Message.js offers a robust and scalable solution for modern communication needs. Whether for personal use or organizational deployment, Message.js provides an intuitive, secure, and feature-rich environment for engaging conversations.

### Key Features
- Authentication
   - **User Registration:** Simple and secure sign-up process to onboard new users.
   - **Login/Logout:** Efficient and secure authentication mechanisms to ensure user data protection and integrity.
   - **User Management:** Comprehensive user profile management capabilities, including password recovery and profile updates.
- Creating New Chat Rooms
   - **Individual and Group Chats:** Effortlessly create new chat rooms with one or multiple users, facilitating both personal and team communication.
   - **User Invitations:** Seamlessly invite existing users to join new chat rooms, enhancing collaboration.
- Real-Time Messaging
   - **Instant Communication:** Leverage Socket.io for real-time messaging, ensuring low latency and high responsiveness.
   - **Rich Text Support:** Enable expressive conversations with support for rich text formatting.
- Conversation History
   - **Persistent Storage:** Store all messages securely in a MongoDB database, ensuring data persistence and accessibility.
   - **Message Retrieval:** Easily access and review past conversations to keep track of important information and decisions.
- Chat Room Management
   - **List of Chat Rooms:** Display all created chat rooms in a user-friendly interface, allowing users to quickly navigate between different conversations.
   - **Deleting Chat Rooms:** Provide users with the ability to delete chat rooms, ensuring that obsolete or irrelevant conversations do not clutter the interface.
- Secure Database Management
   - **User Data Protection:** Implement robust security measures to safeguard users' private information and contact lists.
   - **Messaging History:** Ensure that all messaging history is securely stored and easily retrievable, providing users with confidence in the reliability of the platform.

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
   > [!NOTE]
   > After the frontend modules are installed, it will say that there are vulnerabilities, you can ignore this.
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

## Made By
@kgreinke and @francoer