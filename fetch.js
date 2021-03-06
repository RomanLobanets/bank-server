const axios = require("axios");

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2JhYjZlMGQyMTMwNzM0YmEwNGU2OSIsImlhdCI6MTYwMjE3Nzg4NCwiZXhwIjoxNjAyMjY0Mjg0fQ.Vo6ES0IUc8DrR9uH2nwtt6vgbJ1aEFUUWdzEs_sRbjo`;
const money = {
  walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f",
  longitude: "-100",
  latitude: "-100",
  merchant: "Bed",
};

async function run() {
  const [
    { data: a },
    { data: b },
    { data: c },
    { data: d },
    { data: e },
    { data: f },
  ] = await Promise.all([
    axios.put("/transations", { ...money, amountInCents: 100 }),
    axios.put("/transations", { ...money, amountInCents: 200 }),
    axios.put("/transations", { ...money, amountInCents: -400 }),
    axios.put("/transations", { ...money, amountInCents: 100 }),
    axios.put("/transations", { ...money, amountInCents: 200 }),
    axios.put("/transations", { ...money, amountInCents: -600 }),
  ]);
  console.log(a, b, c, d, e, f);
}

run().catch(console.log);
