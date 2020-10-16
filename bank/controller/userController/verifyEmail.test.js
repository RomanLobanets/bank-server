const verifyEmail = require("./verifyEmail");
const { userModel } = require("../../models/index");

describe("verify email test should pass", () => {
  let req;
  let res;
  let next;
  let errorMessage;
  let user = {
    firstName: "Roman",
    lastName: "Lobanets",
  };

  beforeEach(() => {
    res = {
      locals: {
        errorMessage,
      },
    };
    req = {
      params: {
        token: "1234",
      },
    };
    next = jest.fn();
    jest
      .spyOn(userModel, "findByVerificationToken")
      .mockReturnValue(Promise.resolve({ token: "1234" }));
    jest.spyOn(userModel, "verifyUser").mockReturnValue(Promise.resolve(user));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should pass verufy email", async () => {
    await verifyEmail(req, res, next);
    expect(next).toBeCalledWith(null);
    expect(res.locals.user).toBe(user);
  });
});

describe("verify email test should throw token error", () => {
  let req;
  let res;
  let next;
  let errorMessage;
  let user = {
    firstName: "Roman",
    lastName: "Lobanets",
  };

  beforeEach(() => {
    res = {
      locals: {
        errorMessage,
      },
    };
    req = {
      params: {
        token: "1234",
      },
    };
    next = jest.fn();
    jest
      .spyOn(userModel, "findByVerificationToken")
      .mockReturnValue(Promise.resolve());
    jest.spyOn(userModel, "verifyUser").mockReturnValue(Promise.resolve(user));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw verify token error", async () => {
    await verifyEmail(req, res, next);
    expect(next).toBeCalledWith("VERIFYEMAIL");
    expect(res.locals.errorMessage).toBe("verification token doesnt exist");
  });
});

describe("verify email test should throw user error", () => {
  let req;
  let res;
  let next;
  let errorMessage;
  let user = {
    firstName: "Roman",
    lastName: "Lobanets",
  };

  beforeEach(() => {
    res = {
      locals: {
        errorMessage,
      },
    };
    req = {
      params: {
        token: "1234",
      },
    };
    next = jest.fn();
    jest
      .spyOn(userModel, "findByVerificationToken")
      .mockReturnValue(Promise.resolve({ token: "1234" }));
    jest.spyOn(userModel, "verifyUser").mockReturnValue(Promise.resolve());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw verify user error", async () => {
    await verifyEmail(req, res, next);
    expect(next).toBeCalledWith("VERIFYEMAIL");
    expect(res.locals.errorMessage).toBe("user doesnt exist");
  });
});

describe("verify email test should throw general error", () => {
  let req;
  let res;
  let next;
  let errorMessage;
  let user = {
    firstName: "Roman",
    lastName: "Lobanets",
  };

  beforeEach(() => {
    res = {
      locals: {
        errorMessage,
      },
    };
    req = {
      params: {
        token: "1234",
      },
    };
    next = jest.fn();
    jest
      .spyOn(userModel, "findByVerificationToken")
      .mockReturnValue(Promise.resolve({ token: "1234" }));
    jest.spyOn(userModel, "verifyUser").mockReturnValue(Promise.reject());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw verify general error", async () => {
    await verifyEmail(req, res, next);
    expect(next).toBeCalledWith("VERIFYEMAIL");
    expect(res.locals.errorMessage).toBe("Oops something went wrong try later");
  });
});
