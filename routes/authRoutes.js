import { Router } from "express";
import { authService } from "../services/authService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import { validationErrors, serverErrors } from "../utils/createError.js";
import { contextMiddleware } from "../middlewares/context.middleware.js";

const router = Router();

router.use(contextMiddleware);

router.post(
  "/login",
  (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        req.context.validationErrors = validationErrors.emailRequired();
        return next();
      }
      if (!password) {
        req.context.validationErrors = validationErrors.passwordRequired();
        return next();
      }
      // Attempt to login with provided data
      const userData = { email, password };
      const user = authService.login(userData);

      // Set the data for the response middleware
      req.context.data = user;
    } catch (err) {
      req.context.serverErrors = serverErrors.defaultError(err.message);
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
