// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ChangePasswordRequest,
    ChangePasswordResponse,
    ICreateUserRequest,
    IUpdateUserRequest,
    IUserResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of users from the server
const getUsers = () => apiClient.get<IUserResponse[]>('/users')

// API call: creates a new user
// expects data in the format of ICreateUserRequest and returns the created user
const createUser = (data: ICreateUserRequest) =>
    apiClient.post<IUserResponse>('/users', data)

// API call: changes the password of a user
// expects new password data in the format of ChangePasswordRequest and returns the password change response
const changePassword = (data: ChangePasswordRequest) =>
    apiClient.post<ChangePasswordResponse>('/users/change-password', data)

// API call: updates an existing user's information
// expects updated data in the format of IUpdateUserRequest and returns the updated user
const updateUser = (data: IUpdateUserRequest) =>
    apiClient.put<IUserResponse>('/users', data)

// group all functions into a service object
// this object provides all the methods needed for managing users
const userService = {
    getProfile,
    getUsers,
    createUser,
    updateUser,
    changePassword,
}

// export the service so it can be used in other parts of the application
export default userService
