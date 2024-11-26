import { apiClient } from '@/helpers/api-client'
import { IUserResponse } from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getUsers = () => apiClient.get<IUserResponse[]>('/users')

const userService = { getProfile, getUsers }

export default userService
