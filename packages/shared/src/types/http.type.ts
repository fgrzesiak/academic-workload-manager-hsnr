// interface representing the login request, including the username and password fields
export interface LoginRequest {
  username: string; // the username of the user attempting to log in
  password: string; // the password of the user
}

// interface representing the login response, including the token, role, and temporary password status
export interface LoginResponse {
  token: string; // the JWT token issued upon successful login
  role: "CONTROLLER" | "TEACHER"; // the role of the user (controller or teacher)
  isPasswordTemporary: boolean; // indicates if the password is temporary and needs to be changed
}

// interface representing the request for changing a password
export interface ChangePasswordRequest {
  password: string; // the new password to be set
}

// interface representing the response for a successful password change
export interface ChangePasswordResponse {
  success: boolean; // indicates whether the password change was successful
}
