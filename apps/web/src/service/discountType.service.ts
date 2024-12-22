import { apiClient } from '@/helpers/api-client'
import {
    ICreateDiscountTypeRequest,
    IUpdateDiscountTypeRequest,
    IDiscountTypeResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getDiscountTypes = () => apiClient.get<IDiscountTypeResponse[]>('/discountType')
const createDiscountType = (data: ICreateDiscountTypeRequest) =>
    apiClient.post<IDiscountTypeResponse>('/discountType', data)

const updateDiscountType = (data: IUpdateDiscountTypeRequest) =>
    apiClient.put<IDiscountTypeResponse>('/discountType', data)

const discountTypeService = {
    getProfile,
    getDiscountTypes,
    createDiscountType,
    updateDiscountType,
}

export default discountTypeService
