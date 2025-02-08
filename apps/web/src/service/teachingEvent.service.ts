// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateTeachingEventRequest,
    IUpdateTeachingEventRequest,
    ITeachingEventResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of teaching events from the server
const getTeachingEvents = () =>
    apiClient.get<ITeachingEventResponse[]>('/teachingEvent')

// API call: creates a new teaching event
// expects data in the format of ICreateTeachingEventRequest and returns the created teaching event
const createTeachingEvent = (data: ICreateTeachingEventRequest) =>
    apiClient.post<ITeachingEventResponse>('/teachingEvent', data)

// API call: updates an existing teaching event
// expects updated data in the format of IUpdateTeachingEventRequest and returns the updated teaching event
const updateTeachingEvent = (data: IUpdateTeachingEventRequest) =>
    apiClient.put<ITeachingEventResponse>('/teachingEvent', data)

// API call: deletes an existing teaching event
// expects the id of the teaching event
const deleteTeachingEvent = (id: number) =>
    apiClient.delete('/teachingEvent/delete', { id })

// group all functions into a service object
// this object provides all the methods needed for managing teaching events
const teachingEventService = {
    getProfile,
    getTeachingEvents,
    createTeachingEvent,
    updateTeachingEvent,
    deleteTeachingEvent,
}

// export the service so it can be used in other parts of the application
export default teachingEventService
