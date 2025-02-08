// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateTeachingDutyRequest,
    IUpdateTeachingDutyRequest,
    ITeachingDutyResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of teaching duties from the server
const getTeachingDuties = () =>
    apiClient.get<ITeachingDutyResponse[]>('/teachingDuty')

// API call: creates a new teaching duty
// expects data in the format of ICreateTeachingDutyRequest and returns the created teaching duty
const createTeachingDuty = (data: ICreateTeachingDutyRequest) =>
    apiClient.post<ITeachingDutyResponse>('/teachingDuty', data)

// API call: updates an existing teaching duty
// expects updated data in the format of IUpdateTeachingDutyRequest and returns the updated teaching duty
const updateTeachingDuty = (data: IUpdateTeachingDutyRequest) =>
    apiClient.put<ITeachingDutyResponse>('/teachingDuty', data)

// API call: deletes an existing teaching duty
// expects the id of the teaching duty
const deleteTeachingDuty = (id: number) =>
    apiClient.delete('/teachingDuty/delete', { id })

// group all functions into a service object
// this object provides all the methods needed for managing teaching duties
const teachingDutyService = {
    getProfile,
    getTeachingDuties,
    createTeachingDuty,
    updateTeachingDuty,
    deleteTeachingDuty,
}

// export the service so it can be used in other parts of the application
export default teachingDutyService
