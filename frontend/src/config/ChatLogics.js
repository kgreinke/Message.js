export const getSender = (loggedUser, users) => {
  console.log('loggedUser:', loggedUser);
  console.log('users:', users);
  if (!users || users.length < 2 || !loggedUser) {
    return '';
  }
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};
