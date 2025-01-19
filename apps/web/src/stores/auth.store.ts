// import necessary modules from Pinia for state management and the router for navigation
import { defineStore } from 'pinia'

import { router } from '@/helpers'
import { UserStore } from '@/types'

// Create the Pinia store for authentication management
export const useAuthStore = defineStore({
    id: 'auth',  // unique store identifier for authentication
    state: () => ({
        // Initialize state from local storage to keep the user logged in
        user: JSON.parse(
            localStorage.getItem('user') || 'null'  // retrieve the user data from local storage, or null if not present
        ) as UserStore | null,
        
        // Check if the user is authenticated based on the presence of a token
        isAuthenticated: !!JSON.parse(localStorage.getItem('user') || 'null')
            ?.token, 
        
        // Retrieve and store if the user's password is temporary
        isPasswordTemporary: JSON.parse(localStorage.getItem('user') || 'null')
            ?.isPasswordTemporary as UserStore['isPasswordTemporary'] | null,
        
        // Retrieve the user's role from local storage
        role: JSON.parse(localStorage.getItem('user') || 'null')?.role as
            | UserStore['role']
            | null,
    }),
    actions: {
        // Action to handle user login
        async login(user: UserStore) {
            // Update the Pinia store's state with the user's data
            this.user = user
            this.isAuthenticated = true
            this.role = user.role
            this.isPasswordTemporary = user.isPasswordTemporary

            // Save the user data to local storage to persist the login session
            localStorage.setItem('user', JSON.stringify(user))
            
            // Redirect the user to the home page after successful login
            router.push('/')
        },

        // Action to handle user logout
        logout() {
            // Clear the user data from the store and local storage
            this.user = null
            this.isAuthenticated = false
            this.role = null
            this.isPasswordTemporary = null
            localStorage.removeItem('user')  // remove user data from local storage

            // Redirect the user to the login page after logout
            router.push({ name: 'login' })
        },
    },
})
