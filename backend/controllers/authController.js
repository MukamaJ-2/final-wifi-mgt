import bcrypt from 'bcryptjs';
import { executeQuery } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await executeQuery(
      'SELECT id FROM admins WHERE email = ?',
      [email]
    );

    if (!existingAdmin.success) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    if (existingAdmin.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An admin with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create admin
    const result = await executeQuery(
      'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create admin account'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get admin by email
    const adminResult = await executeQuery(
      'SELECT id, email, password_hash FROM admins WHERE email = ?',
      [email]
    );

    if (!adminResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    if (adminResult.data.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const admin = adminResult.data[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(admin.id);

    // Create session record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    await executeQuery(
      'INSERT INTO sessions (admin_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [admin.id, token, expiresAt]
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id;

    // Delete all sessions for this admin
    await executeQuery(
      'DELETE FROM sessions WHERE admin_id = ?',
      [adminId]
    );

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};