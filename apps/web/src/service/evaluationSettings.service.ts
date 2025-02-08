// import the API client and type definitions
import { apiClient } from '@/helpers/api-client'
import {
    ICreateEvaluationSettingsRequest,
    IUpdateEvaluationSettingsRequest,
    IEvaluationSettingsResponse,
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches a list of evaluation settingss from the server
const getEvaluationSettings = () =>
    apiClient.get<IEvaluationSettingsResponse[]>('/evaluationSettings')

// API call: creates a new evaluation settings
// expects data in the format of ICreateEvaluationSettingsRequest and returns the created evaluation settings
const createEvaluationSettings = (data: ICreateEvaluationSettingsRequest) =>
    apiClient.post<IEvaluationSettingsResponse>('/evaluationSettings', data)

// API call: updates an existing evaluation settings
// expects updated data in the format of IUpdateEvaluationSettingsRequest and returns the updated evaluation settings
const updateEvaluationSettings = (data: IUpdateEvaluationSettingsRequest) =>
    apiClient.put<IEvaluationSettingsResponse>('/evaluationSettings', data)

// group all functions into a service object
// this object provides all the methods needed for managing evaluation settingss
const evaluationSettingsService = {
    getProfile,
    getEvaluationSettings,
    createEvaluationSettings,
    updateEvaluationSettings,
}

// export the service so it can be used in other parts of the application
export default evaluationSettingsService
