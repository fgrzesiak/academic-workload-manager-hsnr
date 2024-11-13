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
    }),
    actions: {
        async login(user: UserStore) {
            // update pinia state
            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
            router.push({ name: 'dashboard' })
        },
        logout() {
            this.user = null
            localStorage.removeItem('user')
            router.push({ name: 'login' })
        },
    },
})
