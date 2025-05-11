const createError = (message) => {
    return {
        error: true,
        message
    };
};

// Common validation errors
const validationErrors = {
    missingFields: (fields) => createError(`Missing required fields: ${fields.join(', ')}`),
    extraFields: (fields) => createError(`Extra fields not allowed: ${fields.join(', ')}`),
    idInBody: () => createError('ID should not be provided in body'),
    emailRequired: () => createError('Email is required'),
    passwordRequired: () => createError('Password is required'),
    noFieldsToUpdate: () => createError('At least one field to update must be provided'),
    invalidEmailFormat: () => createError('Email must be a valid Gmail address'),
    invalidPhoneFormat: () => createError('Phone must be in format +380xxxxxxxxx'),
    invalidPasswordFormat: () => createError('Password must be at least 4 characters long'),
    invalidName: (name) => createError(`${name} must be a string with at least 2 characters`),
    invalidPowerRange: () => createError('Power must be a number between 1 and 100'),
    invalidDefenseRange: () => createError('Defense must be a number between 1 and 10'),
    invalidHealthRange: () => createError('Health must be a number between 80 and 120')
};

// Common database-related errors
const databaseErrors = {
    notFound: (entity) => createError(`${entity} not found`),
    duplicateEmail: () => createError('User with this email already exists'),
    duplicatePhone: () => createError('User with this phone already exists'),
    duplicateName: () => createError('Fighter with this name already exists')
};

// Common server errors
const serverErrors = {
    defaultError: (err) => createError(err)
};

export { createError, validationErrors, databaseErrors, serverErrors };