<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import {
    useToast,
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
} from 'primevue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'
import DiscountTypeService from '@/service/discountType.service'
import type {
    IDiscountTypeResponse,
    ICreateDiscountTypeRequest,
} from '@workspace/shared'

// Import PrimeVue-Komponenten
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'
import { getFormStatesAsType } from '@/helpers'

const toast = useToast()

// Lokale Zustände
const loading = ref(false)
const reductions = ref<IDiscountTypeResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const editingRows = ref<any[]>([])
const newReductionDialog = ref(false)
const newReductionSubmitted = ref(false)

// Zod-Schema für die Neuerstellung einer Ermäßigung
const newReductionSchema = z.object({
    discountType: z.string().trim().min(10).max(30),
})
const resolver = ref(zodResolver(newReductionSchema))

// Initialisiere Filter
const initFilters = () => {
    filters.value = {
        discountType: { value: null, matchMode: 'startsWith' },
    }
}
initFilters()

/**
 * Ruft beim Mounten die Ermäßigungsarten ab.
 */
onBeforeMount(() => {
    loading.value = true
    DiscountTypeService.getDiscountTypes().then((res) => {
        if (res.error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Ermäßigungen',
                detail: res.error,
                life: 5000,
            })
        } else {
            reductions.value = res.data
        }
        loading.value = false
    })
})

/**
 * Öffnet den Dialog zur Neuerstellung einer Ermäßigung.
 */
const openNewReduction = () => {
    newReductionSubmitted.value = false
    newReductionDialog.value = true
}

/**
 * Schließt den Dialog und setzt den Formularstatus zurück.
 */
const hideNewReductionDialog = () => {
    newReductionDialog.value = false
    newReductionSubmitted.value = false
}

/**
 * Gibt die initialen Werte für eine neue Ermäßigung zurück.
 */
const getNewReductionValues = (): z.infer<typeof newReductionSchema> => {
    return {
        discountType: '',
    } satisfies ICreateDiscountTypeRequest
}

/**
 * Handler für die Formularübermittlung zur Neuerstellung einer Ermäßigung.
 */
const onCreateReductionFormSubmit = async ({
    valid,
    states,
}: FormSubmitEvent) => {
    if (valid) {
        newReductionSubmitted.value = true
        const newReduction =
            getFormStatesAsType<ICreateDiscountTypeRequest>(states)
        DiscountTypeService.createDiscountType(newReduction).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                reductions.value = [...reductions.value, data]
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Ermäßigung erstellt',
                    life: 3000,
                })
            }
        })
        hideNewReductionDialog()
    }
}

/**
 * Handler zum Speichern der Inline-Bearbeitung einer Ermäßigungszeile.
 */
const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    DiscountTypeService.updateDiscountType(newData).then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            reductions.value = reductions.value.map((u) =>
                u.discountTypeId === data.discountTypeId ? data : u
            )
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Ermäßigung aktualisiert',
                life: 3000,
            })
        }
    })
}
</script>

<template>
    <div>
        <!-- Kopfzeile mit Titel und Button zur Neuerstellung -->
        <div class="mb-4 flex justify-between">
            <h2 class="mb-4 text-xl font-semibold">Ermäßigungsarten</h2>
            <Button
                label="Neue Ermäßigung anlegen"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNewReduction"
            />
        </div>

        <!-- DataTable für Ermäßigungsarten -->
        <DataTable
            :value="reductions"
            :paginator="true"
            :rows="3"
            size="small"
            showGridlines
            data-key="discountTypeId"
            :row-hover="true"
            filter-display="row"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="['discountType']"
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
            <template #empty>Keine Ermäßigungen gefunden.</template>

            <!-- Spalte: ID -->
            <Column
                field="discountTypeId"
                header="ID"
                style="min-width: 6rem"
                sortable
            >
                <template #body="{ data }">{{ data.discountTypeId }}</template>
            </Column>

            <!-- Spalte: Name der Ermäßigung -->
            <Column
                field="discountType"
                header="Name der Ermäßigung"
                style="min-width: 12rem"
                sortable
            >
                <template #body="{ data }">{{ data.discountType }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Ermäßigung suchen"
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

        <!-- Dialog zur Neuerstellung einer Ermäßigung -->
        <Dialog
            v-model:visible="newReductionDialog"
            :style="{ width: '450px' }"
            header="Neue Ermäßigung anlegen"
            :modal="true"
        >
            <Form
                v-slot="$form"
                :resolver="resolver"
                :initial-values="getNewReductionValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateReductionFormSubmit"
            >
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText
                            id="discountType"
                            name="discountType"
                            fluid
                        />
                        <label
                            for="discountType"
                            class="mb-2 block text-lg font-medium"
                        >
                            Name der Ermäßigung
                        </label>
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.discountType?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.discountType.error?.message }}
                    </Message>
                </div>

                <div class="flex flex-row">
                    <Button
                        label="Abbrechen"
                        icon="pi pi-times"
                        text
                        @click="hideNewReductionDialog"
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
