// import the API client and required types for comment operations
import { apiClient } from '@/helpers/api-client'
import {
    ICreateCommentRequest,  // type for the data needed to create a comment
    IUpdateCommentRequest,  // type for the data needed to update a comment
    ICommentResponse,       // type for the response returned when fetching a comment
} from '@workspace/shared'

// API call: fetches the profile of the currently authenticated user
const getProfile = () => apiClient.get('/auth/profile')

// API call: fetches all comments from the server
const getComments = () => apiClient.get<ICommentResponse[]>('/comment')

// API call: creates a new comment on the server
// expects data in the format of ICreateCommentRequest and returns the created comment
const createComment = (data: ICreateCommentRequest) =>
    apiClient.post<ICommentResponse>('/comment', data)

// API call: updates an existing comment on the server
// expects updated data in the format of IUpdateCommentRequest and returns the updated comment
const updateComment = (data: IUpdateCommentRequest) =>
    apiClient.put<ICommentResponse>('/comment', data)

// Group all functions into a service object for easier access
// This object provides all the necessary methods for managing comments
const commentService = {
    getProfile,
    getComments,
    createComment,
    updateComment,
}

// export the comment service for use in other parts of the application
export default commentService
