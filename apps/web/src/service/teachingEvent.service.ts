import { apiClient } from '@/helpers/api-client'
import {
    ICreateTeachingEventRequest,
    IUpdateTeachingEventRequest,
    ITeachingEventResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getTeachingEvents = () => apiClient.get<ITeachingEventResponse[]>('/teachingEvent')
const createTeachingEvent = (data: ICreateTeachingEventRequest) =>
    apiClient.post<ITeachingEventResponse>('/teachingEvent', data)

const updateTeachingEvent = (data: IUpdateTeachingEventRequest) =>
    apiClient.put<ITeachingEventResponse>('/teachingEvent', data)

const teachingEventService = {
    getProfile,
    getTeachingEvents,
    createTeachingEvent,
    updateTeachingEvent,
}

export default teachingEventService
