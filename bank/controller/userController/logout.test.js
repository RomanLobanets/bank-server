const logout = require("./logout");
const { tokenModel } = require("../../models/index");

describe("logout test passed", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest
      .spyOn(tokenModel, "findByUserIdAndTokenAndDelete")
      .mockReturnValue(Promise.resolve({ token: "22233344" }));
    req = jest.fn();
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      locals: {
        token: "22233344",
        user: { _id: "12345" },
      },
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass logput", async () => {
    await logout(req, res, next);

    expect(res.status).toBeCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});

describe("logout with error token doesnt exist", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest
      .spyOn(tokenModel, "findByUserIdAndTokenAndDelete")
      .mockReturnValue(Promise.resolve());
    req = jest.fn();
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      locals: {
        token: "22233344",
        user: { _id: "12345" },
      },
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw error with token doesnt exist", async () => {
    await logout(req, res, next);

    expect(res.locals.errorMessage).toBe("token doesnt exist");
    expect(next).toBeCalledWith("LOGOUTERROR");
  });
});

describe("logout with error global", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest
      .spyOn(tokenModel, "findByUserIdAndTokenAndDelete")
      .mockReturnValue(Promise.reject());
    req = jest.fn();
    next = jest.fn();
    res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      locals: {
        token: "22233344",
        user: { _id: "12345" },
      },
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw global error", async () => {
    await logout(req, res, next);
    expect(res.locals.errorMessage).toBe("Oops something went wrong try later");
    expect(next).toBeCalledWith("LOGOUTERROR");
  });
});
