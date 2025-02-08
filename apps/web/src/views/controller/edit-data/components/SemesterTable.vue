<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    useToast,
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
} from 'primevue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'
import SemesterService from '@/service/semester.service'
import type {
    ISemesterResponse,
    ICreateSemesterRequest,
} from '@workspace/shared'

// Import PrimeVue-Komponenten
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'
import { getFormStatesAsType } from '@/helpers'
import { FilterMatchMode } from '@primevue/core'

// Props: Die Elternkomponente übergibt die Semester-Daten, den Ladezustand und booleanOptions
const props = defineProps<{
    semesters: ISemesterResponse[]
    loading: boolean
    booleanOptions: { label: string; value: boolean }[]
}>()

// Definiere die Events: Wir senden 'semester-created' und 'semester-updated' an den Parent.
const emits = defineEmits<{
    (e: 'semester-created', newSemester: ISemesterResponse): void
    (e: 'semester-updated', updatedSemester: ISemesterResponse): void
}>()

const toast = useToast()

// Lokale Zustände
const filters = ref<DataTableFilterMeta>({})
const editingRows = ref<any[]>([])
const newSemesterDialog = ref(false)
const newSemesterSubmitted = ref(false)

// Zod-Schema für die Neuerstellung eines Semesters
const newSemesterSchema = z.object({
    name: z.string().trim().min(4).max(30),
    active: z.boolean(),
})
const resolver = ref(zodResolver(newSemesterSchema))

// Initialisiere Filter
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.EQUALS }, // Da wir über ein Dropdown filtern, ist "equals" passend
        active: { value: null, matchMode: FilterMatchMode.EQUALS },
    }
}
initFilters()

/**
 * Computed Property: Erzeugt eine Optionsliste basierend auf den vorhandenen Semestern.
 * Jedes Semester wird in ein Objekt mit "label" (Name) und "value" (ID) umgewandelt.
 */
const semesterOptions = computed(() =>
    props.semesters.map((s) => ({
        label: s.name,
        value: s.name, // In der Spalte steht der Name, daher filtern wir auch nach dem Namen und nicht der ID
    }))
)

/**
 * Formatiert einen Boolean-Wert in "Ja" oder "Nein".
 * @param value Boolean
 * @returns "Ja" oder "Nein"
 */
const formatBoolean = (value: boolean) => (value ? 'Ja' : 'Nein')

/**
 * Öffnet den Dialog zur Neuerstellung eines Semesters.
 */
const openNewSemester = () => {
    newSemesterSubmitted.value = false
    newSemesterDialog.value = true
}

/**
 * Schließt den Dialog und setzt den Formularstatus zurück.
 */
const hideNewSemesterDialog = () => {
    newSemesterDialog.value = false
    newSemesterSubmitted.value = false
}

/**
 * Gibt die initialen Werte für ein neues Semester zurück.
 */
const getNewSemesterValues = (): z.infer<typeof newSemesterSchema> => {
    return {
        name: '',
        active: false,
    } satisfies ICreateSemesterRequest
}

/**
 * Handler für die Formularübermittlung zur Neuerstellung eines Semesters.
 */
const onCreateSemesterFormSubmit = async ({
    valid,
    states,
}: FormSubmitEvent) => {
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
                // Neues Semester an den Parent übermitteln:
                emits('semester-created', data)
            }
        })
        hideNewSemesterDialog()
    }
}

/**
 * Handler zum Speichern der Inline-Bearbeitung einer Semesterzeile.
 */
const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    SemesterService.updateSemester(newData).then((res) => {
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
                detail: 'Semester aktualisiert',
                life: 3000,
            })
            // Aktualisiertes Semester an den Parent übermitteln:
            emits('semester-updated', data)
        }
    })
}
</script>

<template>
    <div>
        <!-- Kopfzeile mit Titel und Button zur Neuerstellung -->
        <div class="mb-4 flex justify-between">
            <h2 class="mb-4 text-xl font-semibold">Semester</h2>
            <Button
                label="Neues Semester anlegen"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNewSemester"
            />
        </div>

        <!-- DataTable zur Anzeige und Inline-Bearbeitung der Semester -->
        <DataTable
            :value="props.semesters"
            :paginator="true"
            :rows="3"
            size="small"
            showGridlines
            data-key="id"
            :row-hover="true"
            filter-display="row"
            :loading="props.loading"
            v-model:filters="filters"
            :global-filter-fields="['name']"
            v-model:editing-rows="editingRows"
            editMode="row"
            sortMode="multiple"
            removableSort
            @row-edit-save="onRowEditSave"
            :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }: any) => ({
                        style:
                            state['d_editing'] &&
                            'padding-top: 0.75rem; padding-bottom: 0.75rem',
                    }),
                },
            }"
        >
            <!-- Empty Table State -->
            <template #empty>Keine Semester gefunden.</template>

            <!-- Spalte: ID -->
            <Column field="id" header="ID" style="min-width: 6rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Spalte: Semester-Name -->
            <Column
                field="name"
                header="Name des Semesters"
                style="min-width: 12rem"
                sortable
                :show-filter-menu="false"
            >
                <template #body="{ data }">{{ data.name }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <!-- Hier wird die Filterung per Dropdown umgesetzt -->
                <template #filter="{ filterModel, filterCallback }">
                    <Select
                        @change="filterCallback()"
                        v-model="filterModel.value"
                        :options="semesterOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Semester auswählen"
                        show-clear
                    />
                </template>
            </Column>

            <!-- Spalte: Aktiv? -->
            <Column
                field="active"
                header="Aktiv?"
                style="min-width: 8rem"
                sortable
                :show-filter-menu="false"
            >
                <template #body="{ data }">{{
                    formatBoolean(data.active)
                }}</template>
                <template #editor="{ data, field }">
                    <Select
                        v-model="data[field]"
                        :options="props.booleanOptions"
                        option-label="label"
                        option-value="value"
                        fluid
                    />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select
                        @change="filterCallback()"
                        v-model="filterModel.value"
                        :options="props.booleanOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Aktiv?"
                        show-clear
                    />
                </template>
            </Column>

            <!-- Spalte für den Zeileneditor -->
            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>
        </DataTable>

        <!-- Dialog zur Neuerstellung eines Semesters -->
        <Dialog
            v-model:visible="newSemesterDialog"
            :style="{ width: '450px' }"
            header="Neues Semester anlegen"
            :modal="true"
        >
            <Form
                v-slot="$form"
                :resolver="resolver"
                :initial-values="getNewSemesterValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateSemesterFormSubmit"
            >
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
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.name?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.name.error?.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="active"
                            name="active"
                            :options="props.booleanOptions"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="active"
                            class="mb-2 block text-lg font-medium"
                        >
                            Aktiv?
                        </label>
                    </FloatLabel>
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

                <div class="flex flex-row">
                    <Button
                        label="Abbrechen"
                        icon="pi pi-times"
                        text
                        @click="hideNewSemesterDialog"
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
    </div>
</template>
