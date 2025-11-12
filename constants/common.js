const successMessages = {
  LOGIN_SUCCESS: 'Login successful',
  CATEGORY_SUCCESS: 'Category created successfully',
  CATEGORY_UPDATE_SUCCESS: 'Category updated successfully',
  REGISTER_SUCCESS: 'User registered successfully',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  TICKET_SUCCESS: 'Ticket created successfully',
  TICKET_UPDATE_SUCCESS: 'Ticket updated successfully',
  AGENT_COMMENT_ADDED: 'Agent comment added successfully',
  CATEGORY_STATUS_TOGGLE_SUCCESS: 'Category status changed successfully',
  USER_STATUS_TOGGLE_SUCCESS: 'User status changed successfully'
};
const errorMessages = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists with this email',
  EMAIL_PASSWORD_REQUIRED: 'Please provide email and password',
  ACCOUNT_DEACTIVATED: 'Account is deactivated. Please contact administrator.',
  REGISTRATION_ERROR: 'Error in user registration',
  PROFILE_UPDATE_ERROR: 'Error updating profile',
  ROUTE_ERROR: 'Route not found',
  TICKET_ERROR: 'Ticket not found',
  CATEGORY_ALREADY_EXIST: 'Category already exists',
  CATEGORY_NOT_FOUND: 'Category not found'
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

module.exports = { successMessages, errorMessages, HTTP_STATUS };
