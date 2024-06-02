export const isSameSenderMargin = (messages, message, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1]?.sender?._id === message.sender?._id &&
    messages[index]?.sender?._id !== userId
  ) {
    return 33;
  } else if (
    index < messages.length - 1 &&
    messages[index + 1]?.sender?._id !== message.sender?._id &&
    messages[index]?.sender?._id !== userId 
  ) {
    return 0;
  } else if (
    index === messages.length - 1 &&
    messages[index]?.sender?._id !== userId
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameSender = (messages, message, index, userId) => {
  // Check if the message or the sender is undefined
  if (!message || !message.sender || !message.sender._id) {
    return false;
  }

  // Check if the next message exists and has a sender
  if (index < messages.length - 1 && messages[index + 1]?.sender) {
    // Check if the next message has a different sender than the current message
    return messages[index + 1].sender._id !== message.sender._id;
  }

  // If the above conditions are not met, return false
  return false;
};

export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1]?.sender?._id !== userId &&
    messages[messages.length - 1]?.sender?._id
  );
};

export const isSameUser = (messages, message, index) => {
  return (
    index > 0 &&
    messages[index - 1]?.sender?._id === message?.sender?._id
  );
};

export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};