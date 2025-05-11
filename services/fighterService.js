import { fighterRepository } from "../repositories/fighterRepository.js";
import { databaseErrors } from "../utils/createError.js";

class FighterService {
  // Get all fighters
  getAllFighters() {
    const fighters = fighterRepository.getAll();
    return fighters;
  }

  // Get fighter by id
  getFighterById(id) {
    const fighter = fighterRepository.getOne({ id });
    if (!fighter) {
      return null;
    }
    return fighter;
  }

  // Create fighter
  createFighter(fighterData) {
    const existingFighter = this.search({ name: fighterData.name });

    if (existingFighter) {
      return databaseErrors.duplicateName();
    }

    const fighter = fighterRepository.create(fighterData);
    return fighter;
  }

  // Update fighter
  updateFighter(id, fighterData) {
    const fighterToUpdate = fighterRepository.getOne({ id });

    if (!fighterToUpdate) {
      return null;
    }

    if (fighterData.name) {
      const existingFighter = this.search({ name: fighterData.name });

      if (existingFighter && existingFighter.id !== id) {
        return databaseErrors.duplicateName();
      }
    }

    const updatedFighter = fighterRepository.update(id, fighterData);
    return updatedFighter;
  }

  // Delete fighter
  deleteFighter(id) {
    const fighterToDelete = fighterRepository.getOne({ id });

    if (!fighterToDelete) {
      return null;
    }

    const deletedFighters = fighterRepository.delete(id);
    return fighterToDelete;
  }

  // Search for a fighter by any criteria
  search(search) {
    const item = fighterRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }
}

const fighterService = new FighterService();

export { fighterService };
