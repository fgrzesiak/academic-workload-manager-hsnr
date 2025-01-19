// import necessary modules from Pinia and PrimeVue for toast notifications
import { defineStore } from 'pinia'
import { ToastMessageOptions } from 'primevue'
import { useToast } from 'primevue/usetoast'

// Define the state type for the alert store
interface AlertState {
    toast: ReturnType<typeof useToast>  // type for the toast instance
}

// Define the options for showing the alert toast
interface ShowOptions {
    severity?: ToastMessageOptions['severity']  // Toast severity (e.g., success, error)
    summary: string  // Short summary of the alert
    detail: string   // Detailed description of the alert
    life?: number    // Duration the toast will be visible (in milliseconds)
}

// Create a Pinia store for managing toast notifications
export const useAlertStore = defineStore({
    id: 'alert',  // unique store identifier
    state: (): AlertState => ({
        toast: useToast(),  // Initialize the toast instance from PrimeVue
    }),
    actions: {
        // Action to show a toast with customizable options
        show({
            severity = 'success',  // default severity is 'success'
            summary,               // required summary text
            detail,                // required detail text
            life = 3000,           // default duration is 3000ms
        }: ShowOptions) {
            // Add the toast notification with the provided options
            this.toast.add({
                severity,
                summary,
                detail,
                life,
            })
        },
    },
})
