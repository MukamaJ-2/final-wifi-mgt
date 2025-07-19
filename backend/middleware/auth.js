import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
    
    // Check if session exists and is valid
    const sessionResult = await executeQuery(
      'SELECT * FROM sessions WHERE admin_id = ? AND expires_at > NOW()',
      [decoded.adminId]
    );

    if (!sessionResult.success || sessionResult.data.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }

    // Get admin details
    const adminResult = await executeQuery(
      'SELECT id, email, created_at FROM admins WHERE id = ?',
      [decoded.adminId]
    );

    if (!adminResult.success || adminResult.data.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    req.admin = adminResult.data[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const generateToken = (adminId) => {
  return jwt.sign(
    { adminId },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};