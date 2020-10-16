const validateUpdateUser = require("./validateUpdateUser");

describe("validateSignIn test pass", () => {
  let res;
  let req;
  let next;
  beforeEach(() => {
    req = {
      body: {
        firstName: "Roman",
        lastName: "Lobanets",
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
    await validateUpdateUser(req, res, next);
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
        firstName: "Roman",
        lastName: "Lobanets",
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
    await validateUpdateUser(req, res, next);
    expect(res.locals.errorMessage).toBe("Email should be a string");
    expect(next).toBeCalledWith("UPDATEUSERERROR");
  });
});

describe("validateSignIn throw error on firstName", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      body: {
        firstName: 1,
        lastName: "Lobanets",
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
    await validateUpdateUser(req, res, next);
    expect(res.locals.errorMessage).toBe("First name should be a string");
    expect(next).toBeCalledWith("UPDATEUSERERROR");
  });
});

describe("validateSignIn throw error on lastName", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      body: {
        firstName: "Roman",
        lastName: 1,
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
  it("should throw password error", async () => {
    await validateUpdateUser(req, res, next);
    expect(res.locals.errorMessage).toBe("Last name should be a string");
    expect(next).toBeCalledWith("UPDATEUSERERROR");
  });
});

// describe("validateSignIn throw error on password", () => {
//   let res;
//   let req;
//   let next;
//   let errorMessage;
//   beforeEach(() => {
//     req = {
//       body: {
//         firstName: "Roman",
//         lastName: "Lobanets",
//         email: "lobanets@gmail.com",
//         password: 1234,
//       },
//     };
//     res = { locals: { errorMessage } };
//     next = jest.fn();
//   });
//   afterEach(() => {
//     jest.resetAllMocks();
//   });
//   it("should throw password error", async () => {
//     await validateUpdateUser(req, res, next);
//     expect(res.locals.errorMessage).toBe("Password name should be a string");
//     expect(next).toBeCalledWith("UPDATEUSERERROR");
//   });
// });

// describe("validateSignIn throw error on extra field", () => {
//   let res;
//   let req;
//   let next;
//   let errorMessage;
//   beforeEach(() => {
//     req = {
//       body: {
//         firstName: "Roman",
//         lastName: "Lobanets",
//         email: "lobanets@gmail.com",
//         password: "roman",
//         name: "wrong field",
//       },
//     };
//     res = { locals: { errorMessage } };
//     next = jest.fn();
//   });
//   afterEach(() => {
//     jest.resetAllMocks();
//   });
//   it("should throw extra field  error", async () => {
//     await validateUpdateUser(req, res, next);
//     expect(res.locals.errorMessage).toBe('"name" is not allowed');
//     expect(next).toBeCalledWith("UPDATEUSERERROR");
//   });
// });
