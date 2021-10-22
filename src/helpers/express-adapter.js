export const adaptRoute = (controllerMethod) => {
  return async (req, res) => {
    const httpRequest = {
      body: req.body,
    };

    const httpResponse = await controllerMethod(httpRequest);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 400) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      console.log(
        `STATUS: ${httpResponse.statusCode} MESSAGE: ${httpResponse.body?.message}`
      );
      res.status(httpResponse.statusCode).json({
        message: httpResponse.body?.message,
      });
    }
  };
};
