const { expectation } = require("sinon");
const {
  transactionModel,
  userModel,
  tokenModel,
} = require("../../models/index");
const getBalance = require("../../helpers/getBalance");
const signIn = require("./signIn");
require("dotenv").config();

describe("signIn test passed", () => {
  let req;
  let res;
  let next;
  let user = {
    _id: "1234",
    walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f",
    email: "lobanets@gmail.com",
    firstName: "Roman",
    lastName: "Lobanets",
    status: true,
    password: "$2a$04$db/SwwoZ3gGEMlTNs.JYIu19dcpYJNQl8/m5fW3hLkDJBFtxTldVu",
  };

  beforeEach(() => {
    req = { body: { email: "lobanets@gmail.com", password: "roman" } };
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {},
    };

    jest
      .spyOn(userModel, "findUserByEmail")
      .mockReturnValue(Promise.resolve(user));
    jest.spyOn(tokenModel, "create").mockReturnValue(Promise.resolve());
    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve([{ balance: 20 }])); //mock getBalance with session
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass signIn", async () => {
    await signIn(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        email: "lobanets@gmail.com",
        firstName: "Roman",
        lastName: "Lobanets",
        balance: 20,
      })
    );
  });
});

describe("signIn test throw error user doesnt exist or verify", () => {
  let req;
  let res;
  let next;
  let user = {
    _id: "1234",
    walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f",
    email: "lobanets@gmail.com",
    firstName: "Roman",
    lastName: "Lobanets",
    status: true,
    password: "$2a$04$db/SwwoZ3gGEMlTNs.JYIu19dcpYJNQl8/m5fW3hLkDJBFtxTldVu",
  };

  beforeEach(() => {
    req = { body: { email: "lobanets@gmail.com", password: "roman" } };
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {},
    };

    jest.spyOn(userModel, "findUserByEmail").mockReturnValue(Promise.resolve());
    jest.spyOn(tokenModel, "create").mockReturnValue(Promise.resolve());
    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve([{ balance: 20 }]));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw error user doesnt exist", async () => {
    await signIn(req, res, next);
    expect(next).toBeCalledWith("SIGNINERROR");
    expect(res.locals.errorMessage).toBe("user doesnt exist or verified");
  });
});

describe("signIn test throw error wrong password", () => {
  let req;
  let res;
  let next;
  let user = {
    _id: "1234",
    walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f",
    email: "lobanets@gmail.com",
    firstName: "Roman",
    lastName: "Lobanets",
    status: true,
    password: "$2a$04$db/SwwoZ3gGEMlTNs.JYIu19dcpYJNQl8/m5fW3hLkDJBFtxTldVu",
  };

  beforeEach(() => {
    req = { body: { email: "lobanets@gmail.com", password: "wrong password" } };
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {},
    };

    jest
      .spyOn(userModel, "findUserByEmail")
      .mockReturnValue(Promise.resolve(user));
    jest.spyOn(tokenModel, "create").mockReturnValue(Promise.resolve());
    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve([{ balance: 20 }]));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw error password doesnt exist", async () => {
    await signIn(req, res, next);
    expect(next).toBeCalledWith("SIGNINERROR");
    expect(res.locals.errorMessage).toBe("wrong password");
  });
});

describe("signIn throw global error", () => {
  let req;
  let res;
  let next;
  let user = {
    _id: "1234",
    walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f",
    email: "lobanets@gmail.com",
    firstName: "Roman",
    lastName: "Lobanets",
    status: true,
    password: "$2a$04$db/SwwoZ3gGEMlTNs.JYIu19dcpYJNQl8/m5fW3hLkDJBFtxTldVu",
  };

  beforeEach(() => {
    req = { body: { email: "lobanets@gmail.com", password: "roman" } };
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {},
    };

    jest
      .spyOn(userModel, "findUserByEmail")
      .mockReturnValue(Promise.reject(user));
    jest.spyOn(tokenModel, "create").mockReturnValue(Promise.resolve()); //want to reject to get a global error
    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve([{ balance: 20 }]));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw global error", async () => {
    await signIn(req, res, next);
    expect(next).toBeCalledWith("SIGNINERROR");
    expect(res.locals.errorMessage).toBe("Oops something went wrong try again");
  });
});
