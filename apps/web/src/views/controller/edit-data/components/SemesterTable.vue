<script setup lang="ts">
/**
 * @file SemesterTable.vue
 * @description Komponente zur Anzeige und Bearbeitung der Semester in einer DataTable.
 *              Enthält Inline-Bearbeitung sowie einen Button zum Anlegen eines neuen Semesters.
 */

import { ref, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

// Services und Typen
import SemesterService from '@/service/semester.service'
import type {
    ISemesterResponse,
    IUpdateSemesterRequest,
} from '@workspace/shared'
import type { DataTableFilterMeta, DataTableRowEditSaveEvent } from 'primevue'
import SemesterCreateDialog from './SemesterCreateDialog.vue'
import { handleServiceCall } from '@/composables/useServiceHandler'

// ----------------------------
// Props & Events
// ----------------------------

/**
 * @typedef Props
 * @property {ISemesterResponse[]} semesters - Liste der Semester
 * @property {boolean} loading - Ladezustand der Daten
 * @property {{ label: string; value: boolean }[]} booleanOptions - Optionen für boolesche Werte (z.B. Aktiv/Nein)
 */
const props = defineProps<{
    semesters: ISemesterResponse[]
    loading: boolean
    booleanOptions: { label: string; value: boolean }[]
}>()

/**
 * Events, die an die Elternkomponente weitergereicht werden:
 * - `semester-created`: Wird ausgelöst, wenn ein neues Semester erstellt wurde.
 * - `semester-updated`: Wird ausgelöst, wenn ein Semester erfolgreich aktualisiert wurde.
 */
const emits = defineEmits<{
    (e: 'semester-created', newSemester: ISemesterResponse): void
    (e: 'semester-updated', updatedSemester: ISemesterResponse): void
}>()

// ----------------------------
// Lokale Zustände & Initialisierungen
// ----------------------------

// Filter für die DataTable
const filters = ref<DataTableFilterMeta>({})
const initFilters = (): void => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.EQUALS }, // Filter per Dropdown
        active: { value: null, matchMode: FilterMatchMode.EQUALS },
    }
}
initFilters()

// Enthält die Zeilen, die gerade im Bearbeitungsmodus sind.
const editingRows = ref<Record<string, unknown>[]>([])

// Steuert die Sichtbarkeit des "Neues Semester anlegen"-Dialogs.
const newSemesterDialogVisible = ref(false)

/**
 * Computed Property: Erzeugt eine Optionsliste aus den vorhandenen Semestern.
 * Diese wird als Filteroption im Namensfeld verwendet.
 */
const semesterOptions = computed(() =>
    props.semesters.map((semester) => ({
        label: semester.name,
        value: semester.name, // Filterung erfolgt über den Namen
    }))
)

/**
 * Formatiert einen booleschen Wert in "Ja" oder "Nein".
 * @param value Der boolesche Wert
 * @returns {string} "Ja" falls true, ansonsten "Nein"
 */
const formatBoolean = (value: boolean): string => (value ? 'Ja' : 'Nein')

/**
 * Öffnet den Dialog zur Neuerstellung eines Semesters.
 */
const openNewSemester = (): void => {
    newSemesterDialogVisible.value = true
}

/**
 * Event-Handler, der ausgelöst wird, sobald in der Dialog-Komponente ein Semester erstellt wurde.
 * Leitet das Event an die Elternkomponente weiter und schließt den Dialog.
 * @param newSemester Das neu erstellte Semester
 */
const handleSemesterCreated = (newSemester: ISemesterResponse): void => {
    emits('semester-created', newSemester)
    newSemesterDialogVisible.value = false
}

/**
 * Handler für das Speichern der Inline-Bearbeitung einer Zeile.
 * Führt ein Update über den SemesterService durch und informiert den Benutzer per Toast.
 * @param event Event-Objekt, das die neuen Daten der Zeile enthält.
 */
const onRowEditSave = async ({
    newData,
}: DataTableRowEditSaveEvent): Promise<void> => {
    const data = await handleServiceCall(
        SemesterService.updateSemester(newData as IUpdateSemesterRequest),
        'Semester aktualisiert',
        'Fehler beim Aktualisieren des Semesters'
    )
    if (data) {
        emits('semester-updated', data)
    }
}
</script>

<template>
    <div>
        <!-- Kopfzeile mit Titel und Button zum Anlegen eines neuen Semesters -->
        <div class="mb-4 flex justify-between">
            <h2 class="mb-4 text-xl font-semibold">Semester</h2>
            <Button
                label="Neues Semester anlegen"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNewSemester"
            />
        </div>

        <!-- DataTable zur Anzeige und Bearbeitung der Semester -->
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
            <!-- Fallback, falls keine Semester vorhanden sind -->
            <template #empty> Keine Semester gefunden. </template>

            <!-- Spalte: ID -->
            <Column field="id" header="ID" style="min-width: 6rem" sortable>
                <template #body="{ data }">
                    {{ data.id }}
                </template>
            </Column>

            <!-- Spalte: Name des Semesters -->
            <Column
                field="name"
                header="Name des Semesters"
                style="min-width: 12rem"
                sortable
                :show-filter-menu="false"
            >
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <!-- Filterung per Dropdown -->
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
                <template #body="{ data }">
                    {{ formatBoolean(data.active) }}
                </template>
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
            />
        </DataTable>

        <!-- Dialog-Komponente zur Neuerstellung eines Semesters -->
        <SemesterCreateDialog
            v-model:visible="newSemesterDialogVisible"
            :boolean-options="props.booleanOptions"
            @semester-created="handleSemesterCreated"
        />
    </div>
</template>
