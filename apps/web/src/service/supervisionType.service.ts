import { apiClient } from '@/helpers/api-client'
import {
    ICreateSupervisionTypeRequest,
    IUpdateSupervisionTypeRequest,
    ISupervisionTypeResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getSupervisionTypes = () => apiClient.get<ISupervisionTypeResponse[]>('/supervisionType')
const createSupervisionType = (data: ICreateSupervisionTypeRequest) =>
    apiClient.post<ISupervisionTypeResponse>('/supervisionType', data)

const updateSupervisionType = (data: IUpdateSupervisionTypeRequest) =>
    apiClient.put<ISupervisionTypeResponse>('/supervisionType', data)

const supervisionTypeService = {
    getProfile,
    getSupervisionTypes,
    createSupervisionType,
    updateSupervisionType,
}

export default supervisionTypeService
