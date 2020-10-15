const authorize = require("./authorize");
const { userModel, tokenModel } = require("../../models/index");

describe("authorization test", () => {
  let req;
  let res;
  let next;
  let user;
  let errorMessage;
  let userId = "5f7bab6e0d2130734ba04e69";
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2JhYjZlMGQyMTMwNzM0YmEwNGU2OSIsImlhdCI6MTYwMjYyMDYxNSwiZXhwIjoxNjAyNzA3MDE1fQ.T_NItnTSrJ-wYoG3Ana2CyiLebg4L_8Ws8JDbOFrxts";
  beforeEach(() => {
    let result = { data: 111 };
    req = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        userId,
        token,
        user,
        errorMessage,
      },
    };
    next = jest.fn();
    jest
      .spyOn(tokenModel, "findByUserIdAndToken")
      .mockReturnValue(Promise.resolve(result));
    jest
      .spyOn(userModel, "findById")
      .mockReturnValue(Promise.resolve({ user: 123 }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should pass auth token", async () => {
    await authorize(req, res, next);
    expect(authorize).toBeDefined();
    expect(res.locals.token).toBe(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2JhYjZlMGQyMTMwNzM0YmEwNGU2OSIsImlhdCI6MTYwMjYyMDYxNSwiZXhwIjoxNjAyNzA3MDE1fQ.T_NItnTSrJ-wYoG3Ana2CyiLebg4L_8Ws8JDbOFrxts"
    );
  });
});

describe("authorization test with error on token", () => {
  let req;
  let res;
  let next;
  let user;
  let errorMessage;
  let userId = "5f7bab6e0d2130734ba04e69";
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2JhYjZlMGQyMTMwNzM0YmEwNGU2OSIsImlhdCI6MTYwMjYyMDYxNSwiZXhwIjoxNjAyNzA3MDE1fQ.T_NItnTSrJ-wYoG3Ana2CyiLebg4L_8Ws8JDbOFrxts";
  beforeEach(() => {
    let result = { data: 111 };
    req = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        userId,
        token,
        user,
        errorMessage,
      },
    };
    next = jest.fn();
    jest
      .spyOn(tokenModel, "findByUserIdAndToken")
      .mockReturnValue(Promise.resolve(null));
    jest
      .spyOn(userModel, "findById")
      .mockReturnValue(Promise.resolve({ user: 123 }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw error on user doesnt exist", async () => {
    await authorize(req, res, next);
    expect(authorize).toBeDefined();
    expect(res.locals.errorMessage).toBe("token doesnt exist");
    expect(next).toBeCalledWith("AUTHORIZEERROR");
  });
});

describe("authorization test with error on user", () => {
  let req;
  let res;
  let next;
  let user;
  let errorMessage;
  let userId = "5f7bab6e0d2130734ba04e69";
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2JhYjZlMGQyMTMwNzM0YmEwNGU2OSIsImlhdCI6MTYwMjYyMDYxNSwiZXhwIjoxNjAyNzA3MDE1fQ.T_NItnTSrJ-wYoG3Ana2CyiLebg4L_8Ws8JDbOFrxts";
  beforeEach(() => {
    let result = { data: 111 };
    req = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        userId,
        token,
        user,
        errorMessage,
      },
    };
    next = jest.fn();
    jest
      .spyOn(tokenModel, "findByUserIdAndToken")
      .mockReturnValue(Promise.resolve(result));
    jest.spyOn(userModel, "findById").mockReturnValue(Promise.resolve(null));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw error on user doesnt exists", async () => {
    await authorize(req, res, next);
    expect(authorize).toBeDefined();
    expect(res.locals.errorMessage).toBe("user doesnt exist");
    expect(next).toBeCalledWith("AUTHORIZEERROR");
  });
});

describe("authorization test with error", () => {
  let req;
  let res;
  let next;
  let user;
  let errorMessage;
  let userId = "5f7bab6e0d2130734ba04e69";
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2JhYjZlMGQyMTMwNzM0YmEwNGU2OSIsImlhdCI6MTYwMjYyMDYxNSwiZXhwIjoxNjAyNzA3MDE1fQ.T_NItnTSrJ-wYoG3Ana2CyiLebg4L_8Ws8JDbOFrxts";
  beforeEach(() => {
    let result = { data: 111 };
    req = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        userId,
        token,
        user,
        errorMessage,
      },
    };
    next = jest.fn();
    jest
      .spyOn(tokenModel, "findByUserIdAndToken")
      .mockReturnValue(Promise.reject());
    jest.spyOn(userModel, "findById").mockReturnValue(Promise.resolve(result));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw error on global", async () => {
    await authorize(req, res, next);
    expect(authorize).toBeDefined();
    expect(res.locals.errorMessage).toBe(
      "Oops something went wrong with authorize"
    );
    expect(next).toBeCalledWith("AUTHORIZEERROR");
  });
});
