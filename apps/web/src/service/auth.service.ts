import { apiClient } from '@/helpers/api-client'
import { LoginRequest, LoginResponse } from '@workspace/shared'

const login = (_: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', _)

const authService = { login }

export default authService
