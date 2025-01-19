// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateSupervisionRequest,
    IUpdateSupervisionRequest,
    ISupervisionResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of supervisions from the server
const getSupervisions = () =>
    apiClient.get<ISupervisionResponse[]>('/supervision')

// API call: creates a new supervision
// expects data in the format of ICreateSupervisionRequest and returns the created supervision
const createSupervision = (data: ICreateSupervisionRequest) =>
    apiClient.post<ISupervisionResponse>('/supervision', data)

// API call: updates an existing supervision
// expects updated data in the format of IUpdateSupervisionRequest and returns the updated supervision
const updateSupervision = (data: IUpdateSupervisionRequest) =>
    apiClient.put<ISupervisionResponse>('/supervision', data)

// API call: deletes an existing supervision
// expects the id of the supervision to be deleted
const deleteSupervision = (id: number) =>
    apiClient.delete('/supervision/delete', { id })

// group all functions into a service object
// this object provides all the methods needed for managing supervisions
const supervisionService = {
    getProfile,
    getSupervisions,
    createSupervision,
    updateSupervision,
    deleteSupervision,
}

// export the service so it can be used in other parts of the application
export default supervisionService
