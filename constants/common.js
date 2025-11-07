const successMessages = {
  LOGIN_SUCCESS: "Login successful",
  REGISTER_SUCCESS: "User registered successfully",
  PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
  TICKET_SUCCESS: "Ticket created successfully",
  TICKET_UPDATE_SUCCESS: "Ticket updated successfully",
};
const errorMessages = {
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_FOUND: "User not found",
  ALREADY_EXISTS: "User already exists with this email",
  EMAIL_PASSWORD_REQUIRED: "Please provide email and password",
  ACCOUNT_DEACTIVATED: "Account is deactivated. Please contact administrator.",
  REGISTRATION_ERROR: "Error in user registration",
  PROFILE_UPDATE_ERROR: "Error updating profile",
  ROUTE_ERROR: "Route not found",
  TICKET_ERROR: "Ticket not found",
};
module.exports = { successMessages, errorMessages };
