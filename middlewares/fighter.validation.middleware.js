import { FIGHTER } from "../models/fighter.js";
import { validationErrors } from "../utils/createError.js";

const isValidNumber = (value, min, max) =>
  typeof value === 'number' && value >= min && value <= max;

const isValidName = (name) =>
  typeof name === 'string' && name.trim().length >= 2;

const createFighterValid = (req, res, next) => {
  const { id, health, ...fighterData } = req.body;

  // Check if id is present in the request body
  if (id) {
    req.context.validationError = validationErrors.idInBody();
    return next();
  }

  // Check for required fields
  const requiredFields = ['name', 'power', 'defense'];
  const missingFields = requiredFields.filter(field => !fighterData[field]);

  if (missingFields.length > 0) {
    req.context.validationError = validationErrors.missingFields(missingFields);
    return next();
  }

  // Check for extra fields
  const extraFields = Object.keys({ ...fighterData, health }).filter(field => !Object.keys(FIGHTER).includes(field));
  if (extraFields.length > 0) {
    req.context.validationError = validationErrors.extraFields(extraFields)
    return next();
  }

  // Validate name (additional)
  if (!isValidName(fighterData.name)) {
    req.context.validationError = validationErrors.invalidName("Fighter name");
    return next();
  }

  // Validate power (1-100)
  if (!isValidNumber(fighterData.power, 1, 100)) {
    req.context.validationError = validationErrors.invalidPowerRange();
    return next();
  }

  // Validate defense (1-10)
  if (!isValidNumber(fighterData.defense, 1, 10)) {
    req.context.validationError = validationErrors.invalidDefenseRange();
    return next();
  }

  // Validate health if provided (80-120)
  if (health !== undefined && !isValidNumber(health, 80, 120)) {
    req.context.validationError = validationErrors.invalidHealthRange();
    return next();
  }

  // Add default health if not provided
  if (health === undefined) {
    req.body.health = FIGHTER.health;
  }

  next();
};

const updateFighterValid = (req, res, next) => {
  const { id, ...fighterData } = req.body;

  // Check if id is present in the request body
  if (id) {
    req.context.validationError = validationErrors.idInBody();
    return next();
  }

  // Check if at least one field is present
  if (Object.keys(fighterData).length === 0) {
    req.context.validationError = validationErrors.noFieldsToUpdate();
    return next();
  }

  // Check for extra fields
  const extraFields = Object.keys(fighterData).filter(field => !Object.keys(FIGHTER).includes(field));
  if (extraFields.length > 0) {
    req.context.validationError = validationErrors.extraFields(extraFields);
    return next();
  }

  // Validate name (additional)
  if (!isValidName(fighterData.name)) {
    req.context.validationError = validationErrors.invalidFighterName();
    return next();
  }

  // Validate power if provided (1-100)
  if (fighterData.power !== undefined && !isValidNumber(fighterData.power, 1, 100)) {
    req.context.validationError = validationErrors.invalidPowerRange();
    return next();
  }

  // Validate defense if provided (1-10)
  if (fighterData.defense !== undefined && !isValidNumber(fighterData.defense, 1, 10)) {
    req.context.validationError = validationErrors.invalidDefenseRange();
    return next();
  }

  // Validate health if provided (80-120)
  if (fighterData.health !== undefined && !isValidNumber(fighterData.health, 80, 120)) {
    req.context.validationError = validationErrors.invalidHealthRange();
    return next();
  }

  next();
};

export { createFighterValid, updateFighterValid };
