import { apiClient } from '@/helpers/api-client'
import { ITeacherResponse } from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getTeachers = () => apiClient.get<ITeacherResponse[]>('/teacher')

const teacherService = {
    getProfile,
    getTeachers,
}

export default teacherService
