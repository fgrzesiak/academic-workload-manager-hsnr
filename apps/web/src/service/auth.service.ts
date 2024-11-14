import { apiClient } from '@/helpers/api-client'

interface LoginRequest {
    username: string
    password: string
}

interface LoginResponse {
    token: string
    role: 'CONTROLLER' | 'TEACHER'
}

const login = (_: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', _)

const authService = { login }

export default authService
