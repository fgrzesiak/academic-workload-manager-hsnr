import { apiClient } from '@/helpers/api-client';

interface LoginRequest {
    username: string;
    password: string;
}

const login = (_: LoginRequest) => apiClient.post('/auth/login', _);

const authService = { login };

export default authService;
