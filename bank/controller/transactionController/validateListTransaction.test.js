const validateListTransaction = require("./validateListTransaction");

describe("validateListTransaction test pass", () => {
  let res;
  let req;
  let next;
  beforeEach(() => {
    req = {
      params: {
        perPage: 1,
        page: 2,
        start: 1,
        end: 2,
        merchant: "Bank",
      },
    };

    res = jest.fn();
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should pass validateListTransaction", async () => {
    await validateListTransaction(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toBeCalledWith(null);
  });
});

describe("validateListTransaction throw error on perPage", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      params: {
        perPage: "dummy",
        page: 2,
        start: 1,
        end: 2,
        merchant: "Bank",
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw perPage error", async () => {
    await validateListTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe("PerPage should be a number");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateListTransaction throw error on page", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      params: {
        perPage: 1,
        page: "dummy",
        start: 1,
        end: 2,
        merchant: "Bank",
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw page error", async () => {
    await validateListTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe("Page should be a number");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateListTransaction throw error on Start", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      params: {
        perPage: 1,
        page: 2,
        start: "dummy",
        end: 2,
        merchant: "Bank",
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw Start error", async () => {
    await validateListTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe("Start should be a number");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateListTransaction throw error on End", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      params: {
        perPage: 1,
        page: 2,
        start: 1,
        end: "dummy",
        merchant: "Bank",
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw End error", async () => {
    await validateListTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe("End should be a number");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateListTransaction throw error on Merchant", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      params: {
        perPage: 1,
        page: 2,
        start: 1,
        end: 2,
        merchant: 1,
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw Merchant error", async () => {
    await validateListTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe("Merchant should be a string");
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});

describe("validateListTransaction throw error on Merchant", () => {
  let res;
  let req;
  let next;
  let errorMessage;
  beforeEach(() => {
    req = {
      params: {
        perPage: 1,
        page: 2,
        start: 1,
        end: 2,
        merchant: "Bank",
        name: "dummy",
      },
    };
    res = { locals: { errorMessage } };
    next = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should throw Merchant error", async () => {
    await validateListTransaction(req, res, next);
    expect(res.locals.errorMessage).toBe('"name" is not allowed');
    expect(next).toBeCalledWith("VALIDATIONERROR");
  });
});
