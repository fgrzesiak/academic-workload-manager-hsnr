import { apiClient } from '@/helpers/api-client'
import {
    ICreateSemesterRequest,
    IUpdateSemesterRequest,
    ISemesterResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getSemesters = () => apiClient.get<ISemesterResponse[]>('/semester')
const createSemester = (data: ICreateSemesterRequest) =>
    apiClient.post<ISemesterResponse>('/semester', data)

const updateSemester = (data: IUpdateSemesterRequest) =>
    apiClient.put<ISemesterResponse>('/semester', data)

const semesterService = {
    getProfile,
    getSemesters,
    createSemester,
    updateSemester,
}

export default semesterService
