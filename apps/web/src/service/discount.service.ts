import { apiClient } from '@/helpers/api-client'
import {
    ICreateDiscountRequest,
    IUpdateDiscountRequest,
    IDiscountResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getDiscounts = () => apiClient.get<IDiscountResponse[]>('/discount')
const createDiscount = (data: ICreateDiscountRequest) =>
    apiClient.post<IDiscountResponse>('/discount', data)

const updateDiscount = (data: IUpdateDiscountRequest) =>
    apiClient.put<IDiscountResponse>('/discount', data)

const discountService = {
    getProfile,
    getDiscounts,
    createDiscount,
    updateDiscount,
}

export default discountService
