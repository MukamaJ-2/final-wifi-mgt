import express from 'express';
import { 
  registerAdmin, 
  loginAdmin, 
  logoutAdmin, 
  getProfile 
} from '../controllers/authController.js';
import { 
  validateAdminRegistration, 
  validateAdminLogin 
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateAdminRegistration, registerAdmin);
router.post('/login', validateAdminLogin, loginAdmin);

// Protected routes
router.post('/logout', authenticateToken, logoutAdmin);
router.get('/profile', authenticateToken, getProfile);

export default router;