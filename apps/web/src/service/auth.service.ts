// import the API client and the required types for login functionality
import { apiClient } from '@/helpers/api-client'
import { LoginRequest, LoginResponse } from '@workspace/shared'

// API call: sends login request with the provided credentials (LoginRequest)
// and returns the login response (LoginResponse) containing authentication data
const login = (_: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', _)

// Group the login function into a service object for easier access
// This service handles all authentication-related methods
const authService = { login }

// export the auth service for use in other parts of the application
export default authService
