export interface UserStore {
    token: string
    role: 'CONTROLLER' | 'TEACHER'
    isPasswordTemporary: boolean
}
