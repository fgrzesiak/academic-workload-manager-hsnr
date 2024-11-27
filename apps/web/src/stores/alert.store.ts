import { defineStore } from 'pinia'
import { ToastMessageOptions } from 'primevue'
import { useToast } from 'primevue/usetoast'

interface AlertState {
    toast: ReturnType<typeof useToast>
}

interface ShowOptions {
    severity?: ToastMessageOptions['severity']
    summary: string
    detail: string
    life?: number
}

export const useAlertStore = defineStore({
    id: 'alert',
    state: (): AlertState => ({
        toast: useToast(),
    }),
    actions: {
        show({
            severity = 'success',
            summary,
            detail,
            life = 3000,
        }: ShowOptions) {
            this.toast.add({
                severity,
                summary,
                detail,
                life,
            })
        },
    },
})
