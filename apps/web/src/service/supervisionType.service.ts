// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateSupervisionTypeRequest,
    IUpdateSupervisionTypeRequest,
    ISupervisionTypeResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of supervision types from the server
const getSupervisionTypes = () => apiClient.get<ISupervisionTypeResponse[]>('/supervisionType')

// API call: creates a new supervision type
// expects data in the format of ICreateSupervisionTypeRequest and returns the created supervision type
const createSupervisionType = (data: ICreateSupervisionTypeRequest) =>
    apiClient.post<ISupervisionTypeResponse>('/supervisionType', data)

// API call: updates an existing supervision type
// expects updated data in the format of IUpdateSupervisionTypeRequest and returns the updated supervision type
const updateSupervisionType = (data: IUpdateSupervisionTypeRequest) =>
    apiClient.put<ISupervisionTypeResponse>('/supervisionType', data)

// group all functions into a service object
// this object provides all the methods needed for managing supervision types
const supervisionTypeService = {
    getProfile,
    getSupervisionTypes,
    createSupervisionType,
    updateSupervisionType,
}

// export the service so it can be used in other parts of the application
export default supervisionTypeService
