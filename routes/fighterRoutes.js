import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";
import { databaseErrors } from "../utils/createError.js";
import { contextMiddleware } from "../middlewares/context.middleware.js";

const router = Router();
router.use(contextMiddleware)

// GET all fighters
router.get('/', (req, res, next) => {
  const fighters = fighterService.getAllFighters();
  req.context.data = fighters;
  next();
}, responseMiddleware);

// GET fighter by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const fighter = fighterService.getFighterById(id);

  if (!fighter) {
    req.context.notFoundError = databaseErrors.notFound("Fighter");
    return next();
  }

  req.context.data = fighter;
  next();
}, responseMiddleware);

// POST create new fighter
router.post('/', createFighterValid, (req, res, next) => {
  if (req.context.validationError) {
    return next();
  }

  const fighter = fighterService.createFighter(req.body);

  if (fighter.error) {
    req.context.validationError = fighter;
    return next();
  }

  req.context.data = fighter;
  next();
}, responseMiddleware);

// PATCH update fighter
router.patch('/:id', updateFighterValid, (req, res, next) => {
  if (req.context.validationError) {
    return next();
  }

  const { id } = req.params;
  const updatedFighter = fighterService.updateFighter(id, req.body);

  if (!updatedFighter) {
    req.context.notFoundError = databaseErrors.notFound('Fighter');
    return next();
  }

  if (updatedFighter.error) {
    req.context.validationError = updatedFighter;
    return next();
  }

  req.context.data = updatedFighter;
  next();
}, responseMiddleware);

// DELETE fighter
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const deletedFighter = fighterService.deleteFighter(id);

  if (!deletedFighter) {
    req.context.notFoundError = databaseErrors.notFound('Fighter');
    return next();
  }

  req.context.data = deletedFighter;
  next();
}, responseMiddleware);

export { router };
