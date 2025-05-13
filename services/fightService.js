import { fightRepository } from "../repositories/fightRepository.js";
import { fighterService } from "./fighterService.js";
import { databaseErrors } from "../utils/createError.js";

class FightService {
  // Get all fights
  getAllFights() {
    const fight = fightRepository.getAll();
    return fight;
  }

  // Get fight by id
  getFightById(id) {
    const fight = fightRepository.getOne({ id });
    if (!fight) {
      return null;
    }
    return fight;
  }

  // Create fight
  createFight(fightData) {
    const { fighter1, fighter2, log = [] } = fightData;

    // Check if fighters exist
    const f1 = fighterService.getFighterById(fighter1);
    const f2 = fighterService.getFighterById(fighter2);

    if (!f1 || !f2) {
      return databaseErrors.notFound("Fighter");
    }

    // Prevent same fighter fighting itself
    if (fighter1 === fighter2) {
      return databaseErrors.sameFighter();
    }

    // Create and return fight
    const fight = fightRepository.create({ fighter1, fighter2, log });
    return fight;
  }

  // Update fight
  updateFight(id, { log, winner }) {
    const fightToUpdate = fightRepository.getOne({ id });

    if (!fightToUpdate) return null;

    if (fightToUpdate.winner) {
      throw databaseErrors.updateFinishedFight();
    }

    if (log) {
      fightToUpdate.log = [...fightToUpdate.log, ...log];
    }

    if (winner) {
      if (winner.id !== fightToUpdate.fighter1 && winner.id !== fightToUpdate.fighter2) {
        return databaseErrors.invalidWinner();
      }
      fightToUpdate.winner = winner;
    }

    const updatedFight = fightRepository.update(id, fightToUpdate);
    return updatedFight;
  }

  // Delete fight
  deleteFight(id) {
    const fightToDelete = fightRepository.getOne({ id });
    if (!fightToDelete) {
      return null;
    }
    fightRepository.delete(id);
    return fightToDelete;
  }

  // Search for a fight by any criteria
  search(search) {
    const item = fightRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }
}

const fightService = new FightService();

export { fightService };
