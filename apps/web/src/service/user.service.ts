import { apiClient } from '@/helpers/api-client'
import { IUserResponse, User } from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getUsers = () =>
    apiClient.get<IUserResponse[]>('/users').then((res) => {
        const { data, error } = res
        if (data) {
            return {
                data: data.map((user) => User.fromJSON(user)),
                error,
            }
        }
        return res
    })

const userService = { getProfile, getUsers }

export default userService
