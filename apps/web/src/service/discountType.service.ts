// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateDiscountTypeRequest,
    IUpdateDiscountTypeRequest,
    IDiscountTypeResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of discount types from the server
const getDiscountTypes = () =>
    apiClient.get<IDiscountTypeResponse[]>('/discountType')

// API call: creates a new discount type
// expects data in the format of ICreateDiscountTypeRequest and returns the created discount type
const createDiscountType = (data: ICreateDiscountTypeRequest) =>
    apiClient.post<IDiscountTypeResponse>('/discountType', data)

// API call: updates an existing discount type
// expects updated data in the format of IUpdateDiscountTypeRequest and returns the updated discount type
const updateDiscountType = (data: IUpdateDiscountTypeRequest) =>
    apiClient.put<IDiscountTypeResponse>('/discountType', data)

// group all functions into a service object
// this object provides all the methods needed for managing discount types
const discountTypeService = {
    getProfile,
    getDiscountTypes,
    createDiscountType,
    updateDiscountType,
}

// export the service so it can be used in other parts of the application
export default discountTypeService
