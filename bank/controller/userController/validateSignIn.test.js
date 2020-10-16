const validateSignIn = require("./validateSignIn");

describe("validateSignIn test pass", () => {
  let res;
  let req;
  let next;
  beforeEach(() => {
    req = {
      body: {
        email: "lobanets@gmail.com",
        password: "roman",
      },
    };
    res = jest.fn();
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass validateSignIn", async () => {
    await validateSignIn(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toBeCalledWith(null);
  });
});

describe("validateSignIn throw error on email", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      body: {
        email: "wrong email",
        password: "roman",
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw email error", async () => {
    await validateSignIn(req, res, next);
    expect(res.locals.errorMessage).toBe("Email Is required");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateSignIn throw error on password", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      body: {
        email: "lobanets@gmail.com",
        password: 1234,
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw password error", async () => {
    await validateSignIn(req, res, next);
    expect(res.locals.errorMessage).toBe("Password Is required");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateSignIn throw error on extra field", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      body: {
        name: "ffff",
        email: "lobanets@gmail.com",
        password: "roman",
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw extra field  error", async () => {
    await validateSignIn(req, res, next);
    expect(res.locals.errorMessage).toBe('"name" is not allowed');
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});
