import { apiClient } from '@/helpers/api-client'

const getProfile = () => apiClient.get('/auth/profile')

const userService = { getProfile }

export default userService
