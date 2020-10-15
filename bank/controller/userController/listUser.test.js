const userModel = require("../../models/userModel");
const listUsers = require("./listUsers");

describe("List of users", () => {
  let mReq;
  let mRes;
  let mNext;
  const expected = [
    {
      email: "fff@ffff",
      firstName: "fhfhg",
      lastName: "fhgggh",
    },
    {
      email: "fff@ffff",
      firstName: "fhfhg",
      lastName: "fhgggh",
    },
  ];

  beforeEach(() => {
    jest.spyOn(userModel, "find").mockReturnValue(Promise.resolve(expected));
    mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mNext = jest.fn();
    mReq = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show list of users", async () => {
    await listUsers(mReq, mRes, mNext);
    expect(listUsers).toBeDefined();
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith(expected);
  });
});

describe("list users error", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest
      .spyOn(userModel, "find")
      .mockReturnValue(Promise.reject(new Error("test")));
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        errorMessage: jest.fn(),
      },
    };
    next = jest.fn();
    req = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw error", async () => {
    await listUsers(req, res, next);
    expect(listUsers).toBeDefined();
    expect(next).toBeCalledWith("LISTUSERSERROR");
    expect(res.locals.errorMessage).toBe(
      "something went wrong please try later"
    );
  });
});
