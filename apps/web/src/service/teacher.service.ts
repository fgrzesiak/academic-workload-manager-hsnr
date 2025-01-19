// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import { ITeacherResponse } from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of teachers from the server
const getTeachers = () => apiClient.get<ITeacherResponse[]>('/teacher')

// group all functions into a service object
// this object provides all the methods needed for managing teacher data
const teacherService = {
    getProfile,
    getTeachers,
}

// export the service so it can be used in other parts of the application
export default teacherService
