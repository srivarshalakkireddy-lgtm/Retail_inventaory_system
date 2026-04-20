/**
 * Helper file to mock Express Objects (req, res, next)
 * This allows us to test controllers without actually starting an Express server.
 */

const mockRequest = (data = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    user: {},
    headers: {},
    ...data
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => jest.fn();

module.exports = {
  mockRequest,
  mockResponse,
  mockNext
};
