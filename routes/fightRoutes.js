import { Router } from "express";
import { fightService } from "../services/fightService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFightValid,
  updateFightValid
} from "../middlewares/fight.validation.middleware.js";
import { databaseErrors } from "../utils/createError.js";
import { contextMiddleware } from "../middlewares/context.middleware.js";

const router = Router();
router.use(contextMiddleware)

// GET all fights
router.get('/', (req, res, next) => {
  const fights = fightService.getAllFights();

  req.context.data = fights;
  next();
}, responseMiddleware);

// GET fight by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const fight = fightService.getFightById(id);

  if (!fight) {
    req.context.notFoundError = databaseErrors.notFound("Fight");
    return next();
  }
  req.context.data = fight;
  next();
}, responseMiddleware);

// POST create new fight
router.post('/', createFightValid, (req, res, next) => {
  if (req.context.validationError) {
    return next();
  }

  const fight = fightService.createFight(req.body);

  if (fight.error) {
    req.context.validationError = fight;
    return next();
  }

  req.context.data = fight;
  next();
}, responseMiddleware);

// PATCH create new fight
router.patch('/:id', updateFightValid, (req, res, next) => {
  if (req.context.validationError) {
    return next();
  }
  const { id } = req.params;
  const { log, winner } = req.body;
  const updatedFight = fightService.updateFight(id, { log, winner });

  if (!updatedFight) {
    req.context.notFoundError = databaseErrors.notFound('Fight');
    return next();
  }

  if (updatedFight.error) {
    req.context.validationError = updatedFight;
    return next();
  }

  req.context.data = updatedFight;
  next();
}, responseMiddleware);

// DELETE fight
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const deletedFight = fightService.deleteFight(id);

  if (!deletedFight) {
    req.context.notFoundError = databaseErrors.notFound('Fight');
    return next();
  }

  req.context.data = deletedFight;
  next();
}, responseMiddleware);

export { router };
