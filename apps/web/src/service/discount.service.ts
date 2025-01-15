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

const deleteDiscount = (id: number) =>
    apiClient.delete('/discount/delete', { id })

const discountService = {
    getProfile,
    getDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
}

export default discountService
