<script setup lang="ts">
/**
 * @file SemesterCreateDialog.vue
 * @description Komponente zur Darstellung eines Dialogs mit Formular zur Erstellung eines neuen Semesters.
 *              Nutzt Zod zur Validierung und informiert den Benutzer per Toast.
 */

import { ref } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useToast } from 'primevue/usetoast'
import type { FormSubmitEvent } from '@primevue/forms'

// PrimeVue-Komponenten für den Dialog und Formularelemente
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'
import Button from 'primevue/button'

// Service und Typen
import SemesterService from '@/service/semester.service'
import type {
    ICreateSemesterRequest,
    ISemesterResponse,
} from '@workspace/shared'
import { getFormStatesAsType } from '@/helpers'

// ----------------------------
// Props & Events
// ----------------------------

/**
 * @typedef Props
 * @property {boolean} visible - Steuert die Sichtbarkeit des Dialogs (v-model)
 * @property {{ label: string; value: boolean }[]} booleanOptions - Optionen für boolesche Werte
 */
const props = defineProps<{
    visible: boolean
    booleanOptions: { label: string; value: boolean }[]
}>()

/**
 * Die Komponente unterstützt v-model:visible und gibt zusätzlich das Event `semester-created` aus,
 * wenn ein neues Semester erfolgreich erstellt wurde.
 */
const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'semester-created', value: ISemesterResponse): void
}>()

// ----------------------------
// Lokale Zustände und Validierung
// ----------------------------

const toast = useToast()

// Lokaler Zustand, um anzuzeigen, ob das Formular bereits abgeschickt wurde.
const newSemesterSubmitted = ref(false)

// Zod-Schema für die Validierung des neuen Semesters
const newSemesterSchema = z.object({
    name: z
        .string()
        .trim()
        .min(4, 'Der Name muss mindestens 4 Zeichen lang sein.')
        .max(30, 'Der Name darf maximal 30 Zeichen lang sein.'),
    active: z.boolean(),
})
const resolver = ref(zodResolver(newSemesterSchema))

/**
 * Gibt die initialen Werte für das Formular zurück.
 * @returns {ICreateSemesterRequest} Initialwerte für name und active.
 */
const getNewSemesterValues = (): z.infer<typeof newSemesterSchema> => ({
    name: '',
    active: false,
})

/**
 * Handler, der beim Absenden des Formulars ausgeführt wird.
 * Validiert die Eingaben und erstellt über den SemesterService ein neues Semester.
 * Bei Erfolg wird ein Toast angezeigt und das Event `semester-created` ausgelöst.
 * @param {FormSubmitEvent} payload - Enthält den Validierungsstatus und die Formulardaten.
 */
const onCreateSemesterFormSubmit = async ({
    valid,
    states,
}: FormSubmitEvent): Promise<void> => {
    if (valid) {
        newSemesterSubmitted.value = true
        const newSemester = getFormStatesAsType<ICreateSemesterRequest>(states)
        SemesterService.createSemester(newSemester).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Semester erstellt',
                    life: 3000,
                })
                emits('semester-created', data)
            }
        })
        // Formular zurücksetzen und Dialog schließen
        closeDialog()
    }
}

/**
 * Schließt den Dialog und setzt den abgeschickten Status zurück.
 */
const closeDialog = (): void => {
    newSemesterSubmitted.value = false
    emits('update:visible', false)
}
</script>

<template>
    <!-- Dialog zur Erstellung eines neuen Semesters -->
    <Dialog
        v-model:visible="props.visible"
        :style="{ width: '450px' }"
        header="Neues Semester anlegen"
        :modal="true"
    >
        <!-- Formular zur Eingabe der Semester-Daten -->
        <Form
            v-slot="$form"
            :resolver="resolver"
            :initial-values="getNewSemesterValues()"
            class="flex w-full flex-col gap-4"
            @submit="onCreateSemesterFormSubmit"
        >
            <!-- Eingabefeld für den Namen des Semesters -->
            <div class="mt-2 flex flex-col gap-1">
                <FloatLabel variant="on">
                    <InputText id="name" name="name" fluid />
                    <label for="name" class="mb-2 block text-lg font-medium">
                        Name des Semesters
                    </label>
                </FloatLabel>
                <!-- Fehlermeldung, falls der Name ungültig ist -->
                <!-- @vue-expect-error -->
                <Message
                    v-if="$form.name?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    ><!-- @vue-expect-error -->
                    {{ $form.name.error?.message }}
                </Message>
            </div>

            <!-- Auswahlfeld, ob das Semester aktiv ist -->
            <div class="flex flex-col gap-1">
                <FloatLabel variant="on">
                    <Select
                        label-id="active"
                        name="active"
                        :options="props.booleanOptions"
                        option-label="label"
                        option-value="value"
                        fluid
                    />
                    <label for="active" class="mb-2 block text-lg font-medium">
                        Aktiv?
                    </label>
                </FloatLabel>
                <!-- Fehlermeldung, falls die Auswahl ungültig ist -->
                <!-- @vue-expect-error -->
                <Message
                    v-if="$form.active?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    <!-- @vue-expect-error -->
                    {{ $form.active.error?.message }}
                </Message>
            </div>

            <!-- Buttons: Abbrechen und Erstellen -->
            <div class="flex flex-row">
                <Button
                    label="Abbrechen"
                    icon="pi pi-times"
                    text
                    @click="closeDialog"
                    fluid
                />
                <Button
                    type="submit"
                    icon="pi pi-check"
                    label="Erstellen"
                    fluid
                />
            </div>
        </Form>
    </Dialog>
</template>
