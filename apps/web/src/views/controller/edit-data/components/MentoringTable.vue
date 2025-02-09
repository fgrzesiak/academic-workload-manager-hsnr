<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { DataTableFilterMeta, DataTableRowEditSaveEvent } from 'primevue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'
import SupervisionTypeService from '@/service/supervisionType.service'
import type {
    ISupervisionTypeResponse,
    ICreateSupervisionTypeRequest,
} from '@workspace/shared'

// Import PrimeVue-Komponenten
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'
import { getFormStatesAsType } from '@/helpers'
import { SelectOption } from '@/types'
import { handleServiceCall } from '@/composables/useServiceHandler'

const props = defineProps<{
    semesterSelect: SelectOption[]
}>()

// Lokale Zustände
const loading = ref(false)
const mentorings = ref<ISupervisionTypeResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const editingRows = ref<any[]>([])
const newMentoringDialog = ref(false)
const newMentoringSubmitted = ref(false)

// Zod-Schema für die Neuerstellung einer Betreuungsart
const newMentoringSchema = z.object({
    typeOfSupervision: z.string().trim().min(10).max(30),
    calculationFactor: z.number(),
    validFrom: z
        .number()
        .refine((v) => props.semesterSelect.some((s) => s.value === v)),
})
const resolver = ref(zodResolver(newMentoringSchema))

// Initialisiere Filter
const initFilters = () => {
    filters.value = {
        typeOfSupervision: { value: null, matchMode: 'startsWith' },
        validFrom: { value: null, matchMode: 'startsWith' },
    }
}
initFilters()

/**
 * Formatiert eine Zahl als String im deutschen Format.
 */
const formatNumber = (value: number) => {
    if (value == null) return ''
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

/**
 * Gibt den Namen eines Semesters anhand der ID zurück.
 */
const getSemesterName = (id: number) => {
    const semester = props.semesterSelect.find((s) => s.value === id)
    return semester ? semester.label : 'Unbekannt'
}

/**
 * Ruft beim Mounten die Betreuungsarten ab.
 */
onBeforeMount(async () => {
    loading.value = true
    const data = await handleServiceCall(
        SupervisionTypeService.getSupervisionTypes(),
        null,
        'Fehler beim Laden der Betreuungsarten'
    )
    if (data) {
        mentorings.value = data
    }
    loading.value = false
})

/**
 * Öffnet den Dialog zur Neuerstellung einer Betreuungsart.
 */
const openNewMentoring = () => {
    newMentoringSubmitted.value = false
    newMentoringDialog.value = true
}

/**
 * Schließt den Dialog und setzt den Formularstatus zurück.
 */
const hideNewMentoringDialog = () => {
    newMentoringDialog.value = false
    newMentoringSubmitted.value = false
}

/**
 * Gibt die initialen Werte für eine neue Betreuungsart zurück.
 */
const getNewMentoringValues = (): z.infer<typeof newMentoringSchema> => {
    return {
        typeOfSupervision: '',
        calculationFactor: 1,
        validFrom: 1,
    } satisfies ICreateSupervisionTypeRequest
}

/**
 * Handler für die Formularübermittlung zur Neuerstellung einer Betreuungsart.
 */
const onCreateMentoringFormSubmit = async ({
    valid,
    states,
}: FormSubmitEvent) => {
    if (valid) {
        newMentoringSubmitted.value = true
        const newMentoring =
            getFormStatesAsType<ICreateSupervisionTypeRequest>(states)
        const data = await handleServiceCall(
            SupervisionTypeService.createSupervisionType(newMentoring),
            'Betreuungsart erstellt',
            'Fehler beim Erstellen der Betreuungsart'
        )
        if (data) {
            mentorings.value = [...mentorings.value, data]
        }
        hideNewMentoringDialog()
    }
}

/**
 * Handler zum Speichern der Inline-Bearbeitung einer Betreuungsart.
 */
const onRowEditSave = async ({ newData }: DataTableRowEditSaveEvent) => {
    const data = await handleServiceCall(
        SupervisionTypeService.updateSupervisionType(newData),
        'Betreuungsart aktualisiert',
        'Fehler beim Aktualisieren der Betreuungsart'
    )
    if (data) {
        mentorings.value = mentorings.value.map((u) =>
            u.typeOfSupervisionId === data.typeOfSupervisionId ? data : u
        )
    }
}
</script>

<template>
    <div>
        <!-- Kopfzeile mit Titel und Button zur Neuerstellung -->
        <div class="mb-4 flex justify-between">
            <h2 class="mb-4 text-xl font-semibold">
                Betreuungsart + Multiplikationsfaktor
            </h2>
            <Button
                label="Neue Betreuungsart anlegen"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNewMentoring"
            />
        </div>

        <!-- DataTable für Betreuungsarten -->
        <DataTable
            :value="mentorings"
            :paginator="true"
            :rows="4"
            showGridlines
            size="small"
            data-key="typeOfSupervisionId"
            :row-hover="true"
            filter-display="row"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="['typeOfSupervision']"
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
            <template #empty>Keine Betreuungsarten gefunden.</template>

            <!-- Spalte: ID -->
            <Column
                field="typeOfSupervisionId"
                header="ID"
                style="min-width: 6rem"
                sortable
            >
                <template #body="{ data }">{{
                    data.typeOfSupervisionId
                }}</template>
            </Column>

            <!-- Spalte: Name der Betreuungsart -->
            <Column
                field="typeOfSupervision"
                header="Name der Betreuungsart"
                style="min-width: 12rem"
                sortable
            >
                <template #body="{ data }">{{
                    data.typeOfSupervision
                }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Betreuungsart suchen"
                    />
                </template>
            </Column>

            <!-- Spalte: Multiplikationsfaktor -->
            <Column
                field="calculationFactor"
                header="Multiplikationsfaktor"
                style="min-width: 10rem"
                sortable
            >
                <template #body="{ data }">{{
                    formatNumber(data.calculationFactor)
                }}</template>
                <template #editor="{ data, field }">
                    <InputNumber
                        v-model="data[field]"
                        :step="0.05"
                        :min="0.1"
                        mode="decimal"
                        :minFractionDigits="2"
                        :maxFractionDigits="2"
                        showButtons
                        fluid
                    />
                </template>
            </Column>

            <!-- Spalte: Gültig seit (Semester) -->
            <Column
                field="validFrom"
                header="Gültig seit"
                style="min-width: 10rem"
                sortable
                :show-filter-menu="false"
            >
                <template #body="{ data }">{{
                    getSemesterName(data.validFrom)
                }}</template>
                <template #editor="{ data, field }">
                    <Select
                        v-model="data[field]"
                        :options="props.semesterSelect"
                        option-label="label"
                        option-value="value"
                        fluid
                    />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select
                        @change="filterCallback()"
                        v-model="filterModel.value"
                        :options="props.semesterSelect"
                        option-label="label"
                        option-value="value"
                        placeholder="Semester auswählen"
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

        <!-- Dialog zur Neuerstellung einer Betreuungsart -->
        <Dialog
            v-model:visible="newMentoringDialog"
            :style="{ width: '450px' }"
            header="Neue Betreuungsart anlegen"
            :modal="true"
        >
            <Form
                v-slot="$form"
                :resolver="resolver"
                :initial-values="getNewMentoringValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateMentoringFormSubmit"
            >
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText
                            id="typeOfSupervision"
                            name="typeOfSupervision"
                            fluid
                        />
                        <label
                            for="typeOfSupervision"
                            class="mb-2 block text-lg font-medium"
                        >
                            Name der Betreuungsart
                        </label>
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.typeOfSupervision?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.typeOfSupervision.error?.message }}
                    </Message>
                </div>

                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputNumber
                            id="calculationFactor"
                            name="calculationFactor"
                            :step="0.05"
                            :min="0.05"
                            mode="decimal"
                            :minFractionDigits="2"
                            :maxFractionDigits="2"
                            showButtons
                            fluid
                        />
                        <label
                            for="calculationFactor"
                            class="mb-2 block text-lg font-medium"
                        >
                            Multiplikationsfaktor (SWS)
                        </label>
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.calculationFactor?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.calculationFactor.error?.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="validFrom"
                            name="validFrom"
                            :options="props.semesterSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="validFrom"
                            class="mb-2 block text-lg font-medium"
                        >
                            Gültig ab
                        </label>
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.validFrom?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.validFrom.error?.message }}
                    </Message>
                </div>

                <div class="flex flex-row">
                    <Button
                        label="Abbrechen"
                        icon="pi pi-times"
                        text
                        @click="hideNewMentoringDialog"
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
