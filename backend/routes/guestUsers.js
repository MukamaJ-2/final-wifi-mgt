import express from 'express';
import {
  createGuestUser,
  getGuestUsers,
  updateGuestUser,
  deleteGuestUser,
  toggleGuestUserStatus
} from '../controllers/guestUserController.js';
import {
  validateGuestUserCreation,
  validateGuestUserUpdate
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Guest user routes
router.post('/', validateGuestUserCreation, createGuestUser);
router.get('/', getGuestUsers);
router.put('/:id', validateGuestUserUpdate, updateGuestUser);
router.delete('/:id', deleteGuestUser);
router.patch('/:id/toggle-status', toggleGuestUserStatus);

export default router;