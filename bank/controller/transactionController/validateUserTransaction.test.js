const validateUserTransaction = require("./validateUserTransaction");

describe("validateUserTransaction test pass", () => {
  let res;
  let req;
  let next;
  beforeEach(() => {
    req = {
      body: {
        longitude: 1,
        latitude: 2,
        merchant: "Bank",
        amountInCents: 2,
      },
    };

    res = jest.fn();
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass validateUserTransaction", async () => {
    await validateUserTransaction(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toBeCalledWith(null);
  });
});

describe("validateUserTransaction test throw error on longtitude", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      body: {
        longitude: "dummy",
        latitude: 2,
        merchant: "Bank",
        amountInCents: 2,
      },
    };

    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw error on longtitude", async () => {
    await validateUserTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe("Longitude should be a number");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateUserTransaction test throw general error ", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      body: {
        longitude: 1,
        latitude: 2,
        merchant: "Bank",
        amountInCents: 2,
        name: "111",
      },
    };

    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw general error ", async () => {
    await validateUserTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe('"name" is not allowed');
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});
