const userModel = require("../../models/userModel");
const listUsers = require("./listUsers");

describe("userList service test", () => {
  it("has a module", () => {
    expect(listUsers).toBeDefined();
  });
});

describe("List of users", () => {
  let mReq;
  let mRes;
  let mNext;
  beforeAll(() => {
    jest.spyOn(userModel, "find").mockReturnValue(
      Promise.resolve([
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
      ])
    );
  });

  beforeEach(() => {
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
    await listUsers(mReq, mRes, mNext);
    expect(mRes.status).toBeCalledWith(200);
    expect(mRes.json).toBeCalledWith(expected);
  });
});
describe("list user error", () => {
  let req;
  let res;
  let next;
  beforeAll(() => {
    jest.spyOn(userModel, "find").mockReturnValue(Promise.reject());
  });

  beforeEach(() => {
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
    const expected = "something went wrong please try later";
    await listUsers(req, res, next);
    expect(next).toBeCalledWith("LISTUSERSERROR");
    expect(res.locals.errorMessage).toBe(
      "something went wrong please try later"
    );
  });
});
