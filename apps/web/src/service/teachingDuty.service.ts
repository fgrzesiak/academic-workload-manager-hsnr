import { apiClient } from '@/helpers/api-client'
import {
    ICreateTeachingDutyRequest,
    IUpdateTeachingDutyRequest,
    ITeachingDutyResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getTeachingDuties = () => apiClient.get<ITeachingDutyResponse[]>('/teachingDuty')
const createTeachingDuty = (data: ICreateTeachingDutyRequest) =>
    apiClient.post<ITeachingDutyResponse>('/teachingDuty', data)

const updateTeachingDuty = (data: IUpdateTeachingDutyRequest) =>
    apiClient.put<ITeachingDutyResponse>('/teachingDuty', data)

const deleteTeachingDuty = (id: number) =>
    apiClient.delete('/teachingDuty/delete', { id })

const teachingDutyService = {
    getProfile,
    getTeachingDuties,
    createTeachingDuty,
    updateTeachingDuty,
    deleteTeachingDuty,
}

export default teachingDutyService
