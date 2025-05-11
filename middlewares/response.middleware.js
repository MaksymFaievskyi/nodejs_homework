const responseMiddleware = (req, res, next) => {
  if (req.context.validationError) {
    return res.status(400).json(req.context.validationError);
  }

  if (req.context.serverErrors) {
    return res.status(400).json(req.context.serverErrors);
  }

  if (req.context.notFoundError) {
    return res.status(404).json(req.context.notFoundError);
  }

  if (req.context.data) {
    return res.status(200).json(req.context.data);
  }

  next();
};

export { responseMiddleware };
