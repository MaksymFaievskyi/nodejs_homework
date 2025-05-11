import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import { databaseErrors } from "../utils/createError.js";
import { contextMiddleware } from "../middlewares/context.middleware.js";

const router = Router();


// apply context middleware to all routes in this router
router.use(contextMiddleware);

// GET all users
router.get('/', (req, res, next) => {
  const users = userService.getAllUsers();
  req.context.data = users;
  next();
}, responseMiddleware);

// GET user by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const user = userService.getUserById(id);

  if (!user) {
    req.context.notFoundError = databaseErrors.notFound("User");
    return next();
  }

  req.context.data = user;
  next();
}, responseMiddleware);

// POST create new user
router.post('/', createUserValid, (req, res, next) => {
  if (req.context.validationError) {
    return next();
  }

  const user = userService.createUser(req.body);

  if (user.error) {
    req.context.validationError = user;
    return next();
  }

  req.context.data = user;
  next();
}, responseMiddleware);

// PATCH update user
router.patch('/:id', updateUserValid, (req, res, next) => {
  if (req.context.validationError) {
    return next();
  }

  const { id } = req.params;
  const updatedUser = userService.updateUser(id, req.body);

  if (!updatedUser) {
    req.context.notFoundError = databaseErrors.notFound("User");
    return next();
  }

  if (updatedUser.error) {
    req.context.validationError = updatedUser;
    return next();
  }

  req.context.data = updatedUser;
  next();
}, responseMiddleware);

// DELETE user
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const deletedUser = userService.deleteUser(id);

  if (!deletedUser) {
    req.context.notFoundError = databaseErrors.notFound("User");
    return next();
  }

  req.context.data = deletedUser;
  next();
}, responseMiddleware);

export { router };
