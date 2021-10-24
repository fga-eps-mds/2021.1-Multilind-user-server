export const adaptMiddleware = (middlaware) => {
  return async (req, res, next) => {
    const httpRequest = {
      headers: req.headers,
      body: req.body,
    };
    const httpResponse = await middlaware.execute(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      });
    }
  };
};
