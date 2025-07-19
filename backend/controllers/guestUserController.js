import bcrypt from 'bcryptjs';
import { executeQuery } from '../config/database.js';
import { sendUserCredentials } from '../services/emailService.js';

// Helper function to generate guest username
const generateGuestUsername = (adminEmail, baseUsername) => {
  const domain = adminEmail.split('@')[1];
  const domainPrefix = domain.split('.')[0];
  return `${baseUsername}_${domainPrefix}`;
};

// Helper function to generate random password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const createGuestUser = async (req, res) => {
  try {
    const { baseUsername, password, expirationDays, fullName, email, phoneNumber } = req.body;
    const adminId = req.admin.id;
    const adminEmail = req.admin.email;

    // Validate required fields
    if (!fullName || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and phone number are required'
      });
    }

    // Generate full username
    const username = generateGuestUsername(adminEmail, baseUsername);

    // Check if username already exists
    const existingUser = await executeQuery(
      'SELECT id FROM guest_users WHERE username = ?',
      [username]
    );

    if (!existingUser.success) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    if (existingUser.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    // Create guest user with new fields
    const result = await executeQuery(
      'INSERT INTO guest_users (username, password_hash, expires_at, created_by, full_name, email, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, passwordHash, expiresAt, adminId, fullName, email, phoneNumber]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create guest user'
      });
    }

    // Get the created user
    const newUser = await executeQuery(
      'SELECT id, username, full_name, email, phone_number, created_at, expires_at, is_active FROM guest_users WHERE username = ?',
      [username]
    );

    // Prepare user data for email
    const userDataForEmail = {
      ...newUser.data[0],
      plainPassword: password
    };

    // Send email with credentials
    const emailResult = await sendUserCredentials(userDataForEmail);

    res.status(201).json({
      success: true,
      message: 'Guest user created successfully',
      data: {
        user: newUser.data[0],
        plainPassword: password, // Return plain password for display
        emailSent: emailResult.success,
        emailMessage: emailResult.success ? 'Credentials sent to user email' : 'Failed to send email'
      }
    });

  } catch (error) {
    console.error('Create guest user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getGuestUsers = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const result = await executeQuery(
      `SELECT id, username, full_name, email, phone_number, created_at, expires_at, is_active, updated_at 
       FROM guest_users 
       WHERE created_by = ? 
       ORDER BY created_at DESC`,
      [adminId]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    res.json({
      success: true,
      data: {
        users: result.data
      }
    });

  } catch (error) {
    console.error('Get guest users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateGuestUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, expiresAt } = req.body;
    const adminId = req.admin.id;

    // Verify user belongs to this admin
    const userCheck = await executeQuery(
      'SELECT id FROM guest_users WHERE id = ? AND created_by = ?',
      [id, adminId]
    );

    if (!userCheck.success) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    if (userCheck.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Guest user not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (typeof isActive === 'boolean') {
      updates.push('is_active = ?');
      values.push(isActive);
    }

    if (expiresAt) {
      updates.push('expires_at = ?');
      values.push(new Date(expiresAt));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);

    const result = await executeQuery(
      `UPDATE guest_users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update guest user'
      });
    }

    // Get updated user
    const updatedUser = await executeQuery(
      'SELECT id, username, created_at, expires_at, is_active, updated_at FROM guest_users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Guest user updated successfully',
      data: {
        user: updatedUser.data[0]
      }
    });

  } catch (error) {
    console.error('Update guest user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteGuestUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.id;

    // Verify user belongs to this admin
    const userCheck = await executeQuery(
      'SELECT id FROM guest_users WHERE id = ? AND created_by = ?',
      [id, adminId]
    );

    if (!userCheck.success) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    if (userCheck.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Guest user not found'
      });
    }

    // Delete user
    const result = await executeQuery(
      'DELETE FROM guest_users WHERE id = ?',
      [id]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete guest user'
      });
    }

    res.json({
      success: true,
      message: 'Guest user deleted successfully'
    });

  } catch (error) {
    console.error('Delete guest user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const toggleGuestUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.id;

    // Get current status
    const userResult = await executeQuery(
      'SELECT is_active FROM guest_users WHERE id = ? AND created_by = ?',
      [id, adminId]
    );

    if (!userResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    if (userResult.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Guest user not found'
      });
    }

    const currentStatus = userResult.data[0].is_active;
    const newStatus = !currentStatus;

    // Update status
    const updateResult = await executeQuery(
      'UPDATE guest_users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, id]
    );

    if (!updateResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user status'
      });
    }

    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: {
        isActive: newStatus
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};