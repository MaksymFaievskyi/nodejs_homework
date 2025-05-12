import { validationErrors, databaseErrors } from "../utils/createError.js";
import { FIGHT } from "../models/fight.js";
import { fighterService } from "../services/fighterService.js";

const createFightValid = (req, res, next) => {
    const { id, fighter1, fighter2, log } = req.body;

    // ID should not be in body
    if (id) {
        req.context.validationError = validationErrors.idInBody();
        return next();
    }

    // Check for required fields
    const requiredFields = ["fighter1", "fighter2"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
        req.context.validationError = validationErrors.missingFields(missingFields);
        return next();
    }

    // Check for extra fields
    const allowedFields = Object.keys(FIGHT).filter(key => key !== "id");
    const extraFields = Object.keys(req.body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (extraFields.length > 0) {
        req.context.validationError = validationErrors.extraFields(extraFields);
        return next();
    }

    // Validate that fighter1 and fighter2 exist and are not the same
    const f1 = fighterService.getFighterById(fighter1);
    const f2 = fighterService.getFighterById(fighter2);

    if (!f1 || !f2) {
        req.context.validationError = validationErrors.missingFields(
            [!f1 ? "fighter1" : null, !f2 ? "fighter2" : null].filter(Boolean)
        );
        return next();
    }

    if (fighter1 === fighter2) {
        req.context.validationError = databaseErrors.sameFighter();
        return next();
    }

    // Validate log
    if (log !== undefined && !Array.isArray(log)) {
        req.context.validationError = validationErrors.invalidLog();
        return next();
    }
    next();
};

export { createFightValid };
