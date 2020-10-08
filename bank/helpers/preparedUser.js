module.exports = (users) => {
  if (Array.isArray(users)) {
    return users.map((item) => {
      const { firstName, lastName, email } = item;
      return { firstName, lastName, email };
    });
  } else {
    const { firstName, lastName, email } = users;
    return { firstName, lastName, email };
  }
};
