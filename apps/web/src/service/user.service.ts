import { apiClient } from '@/helpers/api-client'
import {
    ChangePasswordRequest,
    ChangePasswordResponse,
    ICreateUserRequest,
    IUpdateUserRequest,
    IUserResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getUsers = () => apiClient.get<IUserResponse[]>('/users')
const createUser = (data: ICreateUserRequest) =>
    apiClient.post<IUserResponse>('/users', data)

const changePassword = (data: ChangePasswordRequest) =>
    apiClient.post<ChangePasswordResponse>('/users/change-password', data)

const updateUser = (data: IUpdateUserRequest) => apiClient.put<IUserResponse>('/users', data)

const userService = { getProfile, getUsers, createUser, updateUser, changePassword }

export default userService
