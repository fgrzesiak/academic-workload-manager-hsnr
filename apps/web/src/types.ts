export interface UserStore {
    token: string
    role: 'CONTROLLER' | 'TEACHER'
    isPasswordTemporary: boolean
}

// Typdefinition für Select-Optionen (z. B. Semester)
export interface SelectOption {
    label: string
    value: number
}
