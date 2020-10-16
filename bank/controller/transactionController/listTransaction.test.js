const { expectation } = require("sinon");
const { transactionModel } = require("../../models/index");
const listTransaction = require("./listTransaction");

describe("listTransaction test passed", () => {
  let req;
  let res;
  let next;
  let user = [{ array: "array of users" }];

  beforeEach(() => {
    req = {
      query: {
        perPage: 1,
        page: 2,
        start: 1,
        end: 2,
        merchant: "Bank",
      },
    };
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: {
          walletId: "1234",
        },
      },
    };

    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve(user));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass listTransaction", async () => {
    await listTransaction(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(user);
  });
});

describe("listTransaction test passed with out query", () => {
  let req;
  let res;
  let next;
  let user = [{ array: "array of users" }];

  beforeEach(() => {
    req = {
      query: {},
    };
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: {
          walletId: "1234",
        },
      },
    };

    jest
      .spyOn(transactionModel, "aggregate")
      .mockReturnValue(Promise.resolve(user));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass listTransaction without query", async () => {
    await listTransaction(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(user);
  });
});

describe("listTransaction test throw general error", () => {
  let req;
  let res;
  let next;
  let user = [{ array: "array of users" }];

  beforeEach(() => {
    req = {
      query: {
        perPage: 1,
        page: 2,
        start: 1,
        end: 2,
        merchant: "Bank",
      },
    };
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {
        user: {
          walletId: "1234",
        },
      },
    };

    jest.spyOn(transactionModel, "aggregate").mockReturnValue(Promise.reject());
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass listTransaction", async () => {
    await listTransaction(req, res, next);
    expect(next).toBeCalledWith("LISTTRANSERROR");
    expect(res.locals.errorMessage).toBe("Oops smt went wrong try later");
  });
});
