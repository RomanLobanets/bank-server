const updateUser = require("./updateUser");
jest.mock("../../helpers/sendVerificationEmail");
const { userModel } = require("../../models/index");

describe("update user test should pass", () => {
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
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: {
          _id: "1234",
        },
      },
    };
    req = {
      body: {
        password: "roman",
        email: "lobanets@gmail.com",
      },
    };
    next = jest.fn();
    jest.spyOn(userModel, "changeEmail").mockReturnValue(Promise.resolve());
    jest
      .spyOn(userModel, "findUserByIdAndUpdate")
      .mockReturnValue(Promise.resolve(user));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should pass logput", async () => {
    await updateUser(req, res, next);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      email: "lobanets@gmail.com",
      firstName: "Roman",
      lastName: "Lobanets",
    });
  });
});

describe("update user test should pass without pass and email", () => {
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
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: {
          _id: "1234",
        },
      },
    };
    req = {
      body: {
        firstName: "Roman",
        lastName: "Lobanets",
      },
    };
    next = jest.fn();
    jest.spyOn(userModel, "changeEmail").mockReturnValue(Promise.resolve());
    jest
      .spyOn(userModel, "findUserByIdAndUpdate")
      .mockReturnValue(Promise.resolve(user));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should pass logout without pass and email", async () => {
    await updateUser(req, res, next);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      email: "lobanets@gmail.com",
      firstName: "Roman",
      lastName: "Lobanets",
    });
  });
});

describe("update user test should throw global error", () => {
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
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        errorMessage: "",
        user: {
          _id: "1234",
        },
      },
    };
    req = {
      body: {
        password: "roman",
        email: "lobanets@gmail.com",
      },
    };
    next = jest.fn();
    jest.spyOn(userModel, "changeEmail").mockReturnValue(Promise.resolve());
    jest
      .spyOn(userModel, "findUserByIdAndUpdate")
      .mockReturnValue(Promise.resolve()); //want to make reject and get error
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw global error", async () => {
    await updateUser(req, res, next);
    expect(res.locals.errorMessage).toBe("Oops something went wrong try later");
    expect(next).toBeCalledWith("UPDATEUSERERROR");
  });
});
