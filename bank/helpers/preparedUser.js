function preparedUser(users) {
  return users.map((item) => {
    const { firstName, lastName, email } = item;
    return { firstName, lastName, email };
  });
}
module.exports = preparedUser;
