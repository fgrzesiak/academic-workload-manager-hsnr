<script setup lang="ts">
/**
 * @file SemesterCreateDialog.vue
 * @description Komponente zur Darstellung eines Dialogs mit Formular zur Erstellung eines neuen Semesters.
 *              Nutzt Zod zur Validierung, die Basis-Komponente BaseDialogForm zur Anzeige
 *              und handleServiceCall aus dem Composable useServiceHandler zur Service-Abwicklung.
 */

import { ref, computed } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import type { FormSubmitEvent } from '@primevue/forms'

// PrimeVue-Komponenten für das Formular
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'
import Button from 'primevue/button'

// Basis-Komponente für den Dialog
import BaseDialogForm from '@/components/BaseDialogForm.vue'

// Service und Typen
import SemesterService from '@/service/semester.service'
import type {
    ICreateSemesterRequest,
    ISemesterResponse,
} from '@workspace/shared'
import { getFormStatesAsType } from '@/helpers'
import { handleServiceCall } from '@/composables/useServiceHandler'

// ----------------------------
// Props & Events
// ----------------------------
const props = defineProps<{
    visible: boolean
    booleanOptions: { label: string; value: boolean }[]
}>()

const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'semester-created', value: ISemesterResponse): void
}>()

// Computed Property für v-model:visible, um die Prop "visible" schreibbar zu machen
const modelVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emits('update:visible', value),
})

// Lokaler Zustand, um anzuzeigen, ob das Formular bereits abgeschickt wurde.
const newSemesterSubmitted = ref(false)

// ----------------------------
// Validierung mit Zod
// ----------------------------
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

// ----------------------------
// Funktionen für den Dialog
// ----------------------------
/**
 * Schließt den Dialog und setzt den Formularstatus zurück.
 */
const closeDialog = (): void => {
    newSemesterSubmitted.value = false
    emits('update:visible', false)
}

/**
 * Handler für das Absenden des Formulars.
 * Nutzt handleServiceCall zur Service-Abwicklung und gibt bei Erfolg das Event 'semester-created' weiter.
 *
 * @param {FormSubmitEvent} payload - Enthält den Validierungsstatus und die Formulardaten.
 */
const onCreateSemesterFormSubmit = async ({
    valid,
    states,
}: FormSubmitEvent): Promise<void> => {
    if (valid) {
        newSemesterSubmitted.value = true
        const newSemester = getFormStatesAsType<ICreateSemesterRequest>(states)
        const data = await handleServiceCall(
            SemesterService.createSemester(newSemester),
            'Semester erstellt',
            'Fehler beim Erstellen des Semesters'
        )
        if (data) {
            emits('semester-created', data)
        }
        closeDialog()
    }
}
</script>

<template>
    <!-- Verwendung der Basis-Komponente mit computed v-model -->
    <BaseDialogForm
        v-model:visible="modelVisible"
        title="Neues Semester anlegen"
    >
        <template #form>
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
                        <label
                            for="name"
                            class="mb-2 block text-lg font-medium"
                        >
                            Name des Semesters
                        </label>
                    </FloatLabel>
                    <!-- @vue-expect-error-->
                    <Message
                        v-if="$form.name?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        ><!-- @vue-expect-error-->
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
                        <label
                            for="active"
                            class="mb-2 block text-lg font-medium"
                        >
                            Aktiv?
                        </label> </FloatLabel
                    ><!-- @vue-expect-error-->
                    <Message
                        v-if="$form.active?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        ><!-- @vue-expect-error-->
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
        </template>
    </BaseDialogForm>
</template>
