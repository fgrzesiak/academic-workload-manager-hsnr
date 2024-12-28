import { apiClient } from '@/helpers/api-client'
import {
    ICreateCommentRequest,
    IUpdateCommentRequest,
    ICommentResponse,
} from '@workspace/shared'

const getProfile = () => apiClient.get('/auth/profile')
const getComments = () => apiClient.get<ICommentResponse[]>('/comment')
const createComment = (data: ICreateCommentRequest) =>
    apiClient.post<ICommentResponse>('/comment', data)

const updateComment = (data: IUpdateCommentRequest) =>
    apiClient.put<ICommentResponse>('/comment', data)

const commentService = {
    getProfile,
    getComments,
    createComment,
    updateComment,
}

export default commentService
