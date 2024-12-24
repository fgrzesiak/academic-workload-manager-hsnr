import { apiClient } from '@/helpers/api-client'
import {
    ICreateSupervisionRequest,
    IUpdateSupervisionRequest,
    ISupervisionResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getSupervisions = () => apiClient.get<ISupervisionResponse[]>('/supervision')
const createSupervision = (data: ICreateSupervisionRequest) =>
    apiClient.post<ISupervisionResponse>('/supervision', data)

const updateSupervision = (data: IUpdateSupervisionRequest) =>
    apiClient.put<ISupervisionResponse>('/supervision', data)

const supervisionService = {
    getProfile,
    getSupervisions,
    createSupervision,
    updateSupervision,
}

export default supervisionService
