/**
 * @file useServiceHandler.ts
 * @description Generische Funktion zur Abwicklung von Service-Aufrufen.
 *              Zeigt Erfolg- und Fehlermeldungen über Toast an.
 */

import { useToastService } from './useToastService'

/**
 * Führt einen Service-Aufruf aus und zeigt entsprechende Toast-Nachrichten an.
 *
 * @template T Datentyp der zurückgegebenen Daten.
 * @param promise Eine thenable (PromiseLike), die ein Objekt { data, error } zurückgibt.
 * @param successMessage Nachricht bei erfolgreichem Aufruf.
 * @param errorMessage Nachricht bei fehlerhaftem Aufruf.
 * @returns {Promise<T | null>} Gibt die Daten zurück, falls erfolgreich, ansonsten null.
 */
export async function handleServiceCall<T>(
    promise: PromiseLike<{ data: T; error: String | null }>,
    successMessage: string | null,
    errorMessage: string
): Promise<T | null> {
    const toast = useToastService()
    try {
        const res = await promise
        if (res.error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: errorMessage,
                life: 5000,
            })
            console.error(res.error)
            return null
        } else {
            if (successMessage) {
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: successMessage,
                    life: 3000,
                })
            }
            return res.data
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Fehler',
            detail: errorMessage,
            life: 5000,
        })
        console.error(error)
        return null
    }
}
