import { defineStore } from 'pinia'

import { router } from '@/helpers'

interface User {
    token: string
}

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
        isAuthenticated: !!JSON.parse(localStorage.getItem('user') || 'null')
            ?.token,
        returnUrl: null,
    }),
    actions: {
        async login(user: User) {
            // update pinia state
            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
            router.push(this.returnUrl || '/')
        },
        logout() {
            this.user = null
            localStorage.removeItem('user')
            router.push('/auth/login')
        },
    },
})
