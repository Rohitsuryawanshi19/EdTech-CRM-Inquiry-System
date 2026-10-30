const VALID_USER_TYPES = ['Parent', 'Student', 'School'];
const VALID_CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];

export const validateInquiry = (req, res, next) => {
  const { name, email, phone, user_type, category, message } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full Name is required and must be at least 2 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  // Allow international and standard 10 digit Indian phones too
  const cleanedPhone = phone ? phone.replace(/[\s\-\(\)]/g, '') : '';
  if (!cleanedPhone || cleanedPhone.length < 8 || cleanedPhone.length > 15) {
    errors.push('A valid contact phone number is required (8-15 digits).');
  }

  if (!user_type || !VALID_USER_TYPES.includes(user_type)) {
    errors.push(`User Type must be one of: ${VALID_USER_TYPES.join(', ')}.`);
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`);
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.push('Query message is required and must be at least 5 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  // Sanitize trimmed strings
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  req.body.message = message.trim();

  next();
};
