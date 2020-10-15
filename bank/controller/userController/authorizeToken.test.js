const { string } = require("joi");
const authorizeToken = require("./authorizeToken");

require("dotenv").config();

describe("authorizeToken test with error", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      get: jest.fn(() => "Bearer 123"),
    };
    res = {
      locals: {},
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw an error", async () => {
    await authorizeToken(req, res, next);
    expect(next).toBeCalledWith("AUTHORIZEERROR");
    expect(res.locals.errorMessage).toBe("token doesnt veryfied");
  });
});

describe("authorizeToken test comlete passed", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      get: jest.fn(
        () =>
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN2JhYjZlMGQyMTMwNzM0YmEwNGU2OSIsImlhdCI6MTYwMjc3NzMwMywiZXhwIjoxNjAyODYzNzAzfQ.XyPYsZIkZ1wPRKWwjeficCF9KUWYGl1Wkgb05Pj8Bgo"
      ),
    };
    res = {
      locals: {},
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should pass", async () => {
    await authorizeToken(req, res, next);
    expect(next).toBeCalledWith(undefined);
    expect(res.locals.userId).toBeTruthy();
  });
});
