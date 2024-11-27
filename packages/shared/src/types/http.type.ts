export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: "CONTROLLER" | "TEACHER";
  isPasswordTemporary: boolean;
}

export interface ChangePasswordRequest {
  password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
}
