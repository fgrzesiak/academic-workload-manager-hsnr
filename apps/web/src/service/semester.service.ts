// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateSemesterRequest,
    IUpdateSemesterRequest,
    ISemesterResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of semesters from the server
const getSemesters = () => apiClient.get<ISemesterResponse[]>('/semester')

// API call: creates a new semester
// expects data in the format of ICreateSemesterRequest and returns the created semester
const createSemester = (data: ICreateSemesterRequest) =>
    apiClient.post<ISemesterResponse>('/semester', data)

// API call: updates an existing semester
// expects updated data in the format of IUpdateSemesterRequest and returns the updated semester
const updateSemester = (data: IUpdateSemesterRequest) =>
    apiClient.put<ISemesterResponse>('/semester', data)

// group all functions into a service object
// this object provides all the methods needed for managing semesters
const semesterService = {
    getProfile,
    getSemesters,
    createSemester,
    updateSemester,
}

// export the service so it can be used in other parts of the application
export default semesterService
