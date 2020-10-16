const {
  transactionModel,
  userModel,
  tokenModel,
} = require("../../models/index");
const signInOnEmail = require("./signInOnEmail");
require("dotenv").config();

describe("signInOnEmail test passed", () => {
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
    password: "roman",
  };

  beforeEach(() => {
    req = jest.fn();
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: { email: "lobanets@gmail.com", password: "roman" },
      },
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
  it("should pass signInOnEmail", async () => {
    await signInOnEmail(req, res, next);
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

describe("signInOnEmail test error user doesnt exist or status false", () => {
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
    password: "roman",
  };

  beforeEach(() => {
    req = jest.fn();
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: { email: "lobanets@gmail.com", password: "roman" },
      },
    };

    jest
      .spyOn(userModel, "findUserByEmail")
      .mockReturnValue(Promise.resolve({ ...user, status: false }));
    jest.spyOn(tokenModel, "create").mockReturnValue(Promise.resolve());
    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve([{ balance: 20 }])); //mock getBalance with session
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw error user doesnt exist or status false", async () => {
    await signInOnEmail(req, res, next);
    expect(next).toBeCalledWith("SIGNINERROR");
    expect(res.locals.errorMessage).toBe("user doesnt exist or verified");
  });
});

describe(" signInOnEmail test error wrong password", () => {
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
    password: "roman",
  };

  beforeEach(() => {
    req = jest.fn();
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: { email: "lobanets@gmail.com", password: "wrong password" },
      },
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
  it("should throw error wrong password", async () => {
    await signInOnEmail(req, res, next);
    expect(next).toBeCalledWith("SIGNINERROR");
    expect(res.locals.errorMessage).toBe("wrong password");
  });
});

describe("signInOnEmail test global error", () => {
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
    password: "roman",
  };

  beforeEach(() => {
    req = jest.fn();
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: { email: "lobanets@gmail.com", password: "roman" },
      },
    };

    jest
      .spyOn(userModel, "findUserByEmail")
      .mockReturnValue(Promise.reject(user));
    jest.spyOn(tokenModel, "create").mockReturnValue(Promise.resolve());
    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve([{ balance: 20 }])); //mock getBalance with session
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw global error", async () => {
    await signInOnEmail(req, res, next);
    expect(next).toBeCalledWith("SIGNINERROR");
    expect(res.locals.errorMessage).toBe(
      "Oops something went wrong try it later"
    );
  });
});
