module.exports = (transactions) => {
  return transactions.map((item) => {
    const { longitude, latitude, merchant, amountInCents, createdAt } = item;
    const formatedDate = new Date(createdAt).toLocaleString();
    return {
      location: { longitude, latitude },
      merchant,
      amountInCents,
      createdAt: formatedDate,
    };
  });
};
