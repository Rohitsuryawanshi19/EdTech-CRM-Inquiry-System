import { verifyToken } from '../utils/token.js';

/**
 * Custom JWT Authentication Middleware
 * Protects admin routes against unauthenticated or unauthorized access.
 * Extracts token from 'Authorization: Bearer <token>' header.
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Missing Authorization header.',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Expected format: Bearer <token>',
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    req.admin = decoded; // Attach decoded admin payload { id, email, role } to request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'JWT Token has expired. Please log in again.',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid or forged JWT token.',
    });
  }
};
