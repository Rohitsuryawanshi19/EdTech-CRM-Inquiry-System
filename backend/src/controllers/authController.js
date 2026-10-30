import bcrypt from 'bcryptjs';
import { pool, isDBConnected } from '../config/db.js';
import { generateToken } from '../utils/token.js';

// In-memory fallback admin for local instant sandbox testing if Supabase DB is disconnected
const MOCK_ADMIN = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'K12 Hunar Admin',
  email: 'admin@k12hunar.com',
  password_hash: bcrypt.hashSync('Admin@12345', 10),
  role: 'admin',
};

/**
 * Admin Login with Custom JWT Authentication
 * Route: POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let adminRecord = null;

    if (isDBConnected()) {
      const result = await pool.query('SELECT * FROM admins WHERE LOWER(email) = $1 LIMIT 1', [
        normalizedEmail,
      ]);
      adminRecord = result.rows[0];
    } else {
      // Fallback sandbox when DATABASE_URL is not yet configured by the user
      if (normalizedEmail === MOCK_ADMIN.email.toLowerCase()) {
        adminRecord = MOCK_ADMIN;
      }
    }

    if (!adminRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No admin account found with this email.',
      });
    }

    // Custom bcrypt password verification
    const isMatch = await bcrypt.compare(password, adminRecord.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    // Generate Custom JWT Token
    const payload = {
      id: adminRecord.id,
      name: adminRecord.name,
      email: adminRecord.email,
      role: adminRecord.role || 'admin',
    };

    const token = generateToken(payload);

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: payload,
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      error: error.message,
    });
  }
};

/**
 * Get Current Authenticated Admin Details
 * Route: GET /api/auth/me (Protected)
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin profile.',
    });
  }
};
