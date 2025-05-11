import { USER } from "../models/user.js";
import { validationErrors } from "../utils/createError.js";

const isValidName = (name) =>
  typeof name === 'string' && name.trim().length >= 2;

const isGmailEmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return typeof email === 'string' && gmailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\+380\d{9}$/;
  return typeof phone === 'string' && phoneRegex.test(phone);
};

const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 4;
};

const createUserValid = (req, res, next) => {
  const { id, ...userData } = req.body;

  // Check if id is present in the request body
  if (id) {
    req.context.validationError = validationErrors.idInBody();
    return next();
  }

  // Check for required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password'];
  const missingFields = requiredFields.filter(field => !userData[field]);

  if (missingFields.length > 0) {
    req.context.validationError = validationErrors.missingFields(missingFields);
    return next();
  }

  // Check for extra fields
  const extraFields = Object.keys(userData).filter(field => !Object.keys(USER).includes(field));
  if (extraFields.length > 0) {
    req.context.validationError = validationErrors.extraFields(extraFields);
    return next();
  }

  // Validate first name (additional)
  if (!isValidName(userData.firstName)) {
    req.context.validationError = validationErrors.invalidName("First name");
    return next();
  }

  // Validate last name (additional)
  if (!isValidName(userData.lastName)) {
    req.context.validationError = validationErrors.invalidName("Last name");
    return next();
  }

  // Validate email format
  if (!isGmailEmail(userData.email)) {
    req.context.validationError = validationErrors.invalidEmailFormat();
    return next();
  }

  // Validate phone format
  if (!isValidPhone(userData.phone)) {
    req.context.validationError = validationErrors.invalidPhoneFormat();
    return next();
  }

  // Validate password
  if (!isValidPassword(userData.password)) {
    req.context.validationError = validationErrors.invalidPasswordFormat();
    return next();
  }

  next();
};

const updateUserValid = (req, res, next) => {
  const { id, ...userData } = req.body;

  // Check if id is present in the request body
  if (id) {
    req.context.validationError = validationErrors.idInBody();
    return next();
  }

  // Check if at least one field is present
  if (Object.keys(userData).length === 0) {
    req.context.validationError = validationErrors.noFieldsToUpdate();
    return next();
  }

  // Check for extra fields
  const extraFields = Object.keys(userData).filter(field => !Object.keys(USER).includes(field));
  if (extraFields.length > 0) {
    req.context.validationError = validationErrors.extraFields(extraFields);
    return next();
  }

  // Validate first name (additional)
  if (userData.firstName && !isValidName(userData.firstName)) {
    req.context.validationError = validationErrors.invalidName("First name");
    return next();
  }

  // Validate last name (additional)
  if (userData.lastName && !isValidName(userData.lastName)) {
    req.context.validationError = validationErrors.invalidName("Last name");
    return next();
  }

  // Validate email format if provided
  if (userData.email && !isGmailEmail(userData.email)) {
    req.context.validationError = validationErrors.invalidEmailFormat();
    return next();
  }

  // Validate phone format if provided
  if (userData.phone && !isValidPhone(userData.phone)) {
    req.context.validationError = validationErrors.invalidPhoneFormat();
    return next();
  }

  // Validate password if provided
  if (userData.password && !isValidPassword(userData.password)) {
    req.context.validationError = validationErrors.invalidPasswordFormat();
    return next();
  }
  next();
};

export { createUserValid, updateUserValid };
