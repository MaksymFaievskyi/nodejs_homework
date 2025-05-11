import { userRepository } from "../repositories/userRepository.js";
import { databaseErrors } from "../utils/createError.js";

class UserService {
  // Get all users
  getAllUsers() {
    const users = userRepository.getAll();
    return users;
  }

  // Get user by id
  getUserById(id) {
    const user = userRepository.getOne({ id });
    if (!user) {
      return null;
    }
    return user;
  }

  // Create user
  createUser(userData) {
    const existingUserByEmail = this.search({ email: userData.email.toLowerCase() });
    if (existingUserByEmail) {
      return databaseErrors.duplicateEmail();
    }

    const existingUserByPhone = this.search({ phone: userData.phone });
    if (existingUserByPhone) {
      return databaseErrors.duplicatePhone();
    }

    // Convert email to lowercase for case insensitivity
    userData.email = userData.email.toLowerCase();

    const user = userRepository.create(userData);
    return user;
  }

  // Update user
  updateUser(id, userData) {
    const userToUpdate = userRepository.getOne({ id });

    if (!userToUpdate) {
      return null;
    }

    if (userData.email) {
      userData.email = userData.email.toLowerCase();
      const existingUserByEmail = this.search({ email: userData.email });
      if (existingUserByEmail && existingUserByEmail.id !== id) {
        return databaseErrors.duplicateEmail();
      }
    }

    if (userData.phone) {
      const existingUserByPhone = this.search({ phone: userData.phone });
      if (existingUserByPhone && existingUserByPhone.id !== id) {
        return databaseErrors.duplicatePhone();
      }
    }

    const updatedUser = userRepository.update(id, userData);
    return updatedUser;
  }

  // Delete user
  deleteUser(id) {
    const userToDelete = userRepository.getOne({ id });

    if (!userToDelete) {
      return null;
    }

    const deletedUsers = userRepository.delete(id);
    return userToDelete;
  }
  // Search for a user by any criteria
  search(search) {
    const item = userRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }
}

const userService = new UserService();

export { userService };
