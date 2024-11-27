import { defineStore } from 'pinia'

import { router } from '@/helpers'
import { UserStore } from '@/types'

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(
            localStorage.getItem('user') || 'null'
        ) as UserStore | null,
        isAuthenticated: !!JSON.parse(localStorage.getItem('user') || 'null')
            ?.token,
        isPasswordTemporary: JSON.parse(localStorage.getItem('user') || 'null')
            ?.isPasswordTemporary as UserStore['isPasswordTemporary'] | null,
        role: JSON.parse(localStorage.getItem('user') || 'null')?.role as
            | UserStore['role']
            | null,
    }),
    actions: {
        async login(user: UserStore) {
            // update pinia state
            this.user = user
            this.isAuthenticated = true
            this.role = user.role
            this.isPasswordTemporary = user.isPasswordTemporary
            localStorage.setItem('user', JSON.stringify(user))
            router.push('/')
        },
        logout() {
            this.user = null
            this.isAuthenticated = false
            this.role = null
            this.isPasswordTemporary = null
            localStorage.removeItem('user')
            router.push({ name: 'login' })
        },
    },
})
