import { useToast } from 'primevue/usetoast'
import { app } from '@/main'

/**
 * Diese Composable bietet eine Möglichkeit, auf den Toast-Service nicht nur in den Vue-Komponenten,
 * sondern auch in den Composable-Funktionen zuzugreifen.
 * @returns
 */
export const useToastService = () => {
    const getToast: typeof useToast = () => app.config.globalProperties.$toast
    const toastService = getToast()
    return toastService
}
