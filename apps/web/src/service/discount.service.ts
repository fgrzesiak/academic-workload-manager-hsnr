// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateDiscountRequest,
    IUpdateDiscountRequest,
    IDiscountResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of discounts from the server
const getDiscounts = () => apiClient.get<IDiscountResponse[]>('/discount')

// API call: creates a new discount
// expects data in the format of ICreateDiscountRequest and returns the created discount
const createDiscount = (data: ICreateDiscountRequest) =>
    apiClient.post<IDiscountResponse>('/discount', data)

// API call: updates an existing discount
// expects updated data in the format of IUpdateDiscountRequest and returns the updated discount
const updateDiscount = (data: IUpdateDiscountRequest) =>
    apiClient.put<IDiscountResponse>('/discount', data)

// API call: deletes an existing discount
// expects the id of the discount
const deleteDiscount = (id: number) =>
    apiClient.delete('/discount/delete', { id })

// group all functions into a service object
// this object provides all the methods needed for managing discounts
const discountService = {
    getProfile,
    getDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
}

// export the service so it can be used in other parts of the application
export default discountService
