// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateTeachingGroupRequest,
    IUpdateTeachingGroupRequest,
    ITeachingGroupResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of teaching groups from the server
const getTeachingGroups = () => apiClient.get<ITeachingGroupResponse[]>('/teachingGroup')

// API call: creates a new teaching group
// expects data in the format of ICreateTeachingGroupRequest and returns the created teaching group
const createTeachingGroup = (data: ICreateTeachingGroupRequest) =>
    apiClient.post<ITeachingGroupResponse>('/teachingGroup', data)

// API call: updates an existing teaching group
// expects updated data in the format of IUpdateTeachingGroupRequest and returns the updated teaching group
const updateTeachingGroup = (data: IUpdateTeachingGroupRequest) =>
    apiClient.put<ITeachingGroupResponse>('/teachingGroup', data)

// group all functions into a service object
// this object provides all the methods needed for managing teaching groups
const teachingGroupService = {
    getProfile,
    getTeachingGroups,
    createTeachingGroup,
    updateTeachingGroup,
}

// export the service so it can be used in other parts of the application
export default teachingGroupService
