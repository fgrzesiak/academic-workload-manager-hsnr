<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, ref } from 'vue'
import SemesterService from '@/service/semester.service'
import { ISemesterResponse, ICreateSemesterRequest } from '@workspace/shared'
import SupervisionTypeService from '@/service/supervisionType.service'
import { ISupervisionTypeResponse, ICreateSupervisionTypeRequest } from '@workspace/shared'
import DiscountTypeService from '@/service/discountType.service'
import {  IDiscountTypeResponse, ICreateDiscountTypeRequest } from '@workspace/shared'
import {
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
    useToast,
} from 'primevue'
import { getFormStatesAsType } from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

const toast = useToast()

/**
 * New Semester Configuration
 */
const loadingSemester = ref(false)
const semesters = ref<ISemesterResponse[]>([])
const filtersSemester = ref<DataTableFilterMeta>({})
const editingRowsSemester = ref([])
const newSemesterSubmitted = ref(false)
const newSemesterDialog = ref(false)
const newSemesterSchema = z.object({
    name: z.string().trim().min(4).max(30),
    active: z.boolean(),
})

const updateSemester = (data: ISemesterResponse[]) => {
    semesters.value = data.map((d) => {
        return d
    })
}

const resolverSemester = ref(zodResolver(newSemesterSchema))

const openNewSemester = () => {
    newSemesterSubmitted.value = false
    newSemesterDialog.value = true
}

const hideSemesterDialog = () => {
    newSemesterDialog.value = false
    newSemesterSubmitted.value = false
}

const getNewSemesterValues = (): z.infer<typeof newSemesterSchema> => {
    return {
        name: '',
        active: false,
    } satisfies ICreateSemesterRequest
}

const onCreateSemesterFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newSemesterSubmitted.value = true
        const newSemester = getFormStatesAsType<ICreateSemesterRequest>(states)
        // newSemester.active = true //TO-DO: when teacher can send data, this should be set bei controller
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
                updateSemester([...semesters.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Semester erstellt',
                    life: 3000,
                })
            }
        })

        newSemesterDialog.value = false
    }
}

const onRowEditSaveSemester = ({ newData }: DataTableRowEditSaveEvent) => {
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
            data
            updateSemester(semesters.value.map((u) => (u.id === data.id ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Semester aktualisiert',
                life: 3000,
            })
        }
    })
}

// Initialize filters
function initSemesterFilters() {
    filtersSemester.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
    }
}

const booleanOptions = ref([
    { label: 'Ja', value: true },
    { label: 'Nein', value: false },
]);

/**
 * New Mentoring/Supervision Configuration
 */

interface SelectOption {
    label: string;
    value: number;
}

const loadingSupervision = ref(false)
const mentorings = ref<ISupervisionTypeResponse[]>([])
const semesterSelect = ref<SelectOption[]>([])
const filtersMentoring = ref<DataTableFilterMeta>({})
const editingRowsMentoring = ref([])
const newMentoringSubmitted = ref(false)
const newMentoringDialog = ref(false)
const newMentoringSchema = z.object({
    typeOfSupervision: z.string().trim().min(10).max(30),
    calculationFactor: z.number(),
    validFrom: z.number()
})
const resolverMentoring = ref(zodResolver(newMentoringSchema))

const updateSupervisionType = (data: ISupervisionTypeResponse[]) => {
    mentorings.value = data.map((d) => {
        return d
    })
}

const openNewMentoring = () => {
    newMentoringSubmitted.value = false
    newMentoringDialog.value = true
}

const hideMentoringDialog = () => {
    newMentoringDialog.value = false
    newMentoringSubmitted.value = false
}

const getNewMentoringValues = (): z.infer<typeof newMentoringSchema> => {
    return {
        typeOfSupervision: '',
        calculationFactor: 0,
        validFrom: 1,
    } satisfies ICreateSupervisionTypeRequest
}

const onCreateMentoringFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newMentoringSubmitted.value = true
        const newMentoring = getFormStatesAsType<ICreateSupervisionTypeRequest>(states)
        SupervisionTypeService.createSupervisionType(newMentoring).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                updateSupervisionType([...mentorings.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Betreuungsart erstellt',
                    life: 3000,
                })
            }
        })

        newMentoringDialog.value = false
    }
}

const onRowEditSaveMentoring = ({ newData }: DataTableRowEditSaveEvent) => {
    SupervisionTypeService.updateSupervisionType(newData).then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            data
            updateSupervisionType(mentorings.value.map((u) => (u.typeOfSupervisionId === data.typeOfSupervisionId ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Betreuungsart aktualisiert',
                life: 3000,
            })
        }
    })
}

// Initialize filters
function initMentoringFilters() {
    filtersMentoring.value = {
        //global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        typeOfSupervision: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
        validFrom: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
    }
}


/**
 * New Reduction/Discount Configuration
 */
const loadingReduction = ref(false)
const reductions = ref<IDiscountTypeResponse[]>([])
const filtersReduction = ref<DataTableFilterMeta>({})
const editingRowsReduction = ref([])
const newReductionSubmitted = ref(false)
const newReductionDialog = ref(false)
const newReductionSchema = z.object({
    discountType: z.string().trim().min(10).max(30),
})
const resolverReduction = ref(zodResolver(newReductionSchema))

const updateDiscountType = (data: IDiscountTypeResponse[]) => {
    reductions.value = data.map((d) => {
        return d
    })
}

const openNewReduction = () => {
    newReductionSubmitted.value = false
    newReductionDialog.value = true
}

const hideReductionDialog = () => {
    newReductionDialog.value = false
    newReductionSubmitted.value = false
}

const getNewReductionValues = (): z.infer<typeof newReductionSchema> => {
    return {
        discountType: '',
    } satisfies ICreateDiscountTypeRequest
}

const onCreateReductionFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newReductionSubmitted.value = true
        const newReduction = getFormStatesAsType<ICreateDiscountTypeRequest>(states)
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
                updateDiscountType([...reductions.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Ermäßigung erstellt',
                    life: 3000,
                })
            }
        })

        newReductionDialog.value = false
    }
}

const onRowEditSaveReduction = ({ newData }: DataTableRowEditSaveEvent) => {
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
            data
            updateDiscountType(reductions.value.map((u) => (u.discountTypeId === data.discountTypeId ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Ermäßigung aktualisiert',
                life: 3000,
            })
        }
    })
}

// Initialize filters
function initReductionFilters() {
    filtersReduction.value = {
        //global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        discountType: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
    }
}

//convert semester ID into Name
const getSemesterName = (id: number) => {
    const semester = semesterSelect.value.find((s) => s.value === id);
    return semester ? semester.label : 'Unbekannt';
};

/**
 * Global Configuration
 */

onBeforeMount(() => {
    loadingSemester.value = true
    SemesterService.getSemesters().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Semester',
                detail: error,
                life: 5000,
            })
        } else {
            updateSemester(data)
            semesterSelect.value = res.data.map((semester: ISemesterResponse) => ({
                label: semester.name,
                value: semester.id,
            }));
            loadingSemester.value = false
        }
    })
    initSemesterFilters()

    loadingSupervision.value = true
    SupervisionTypeService.getSupervisionTypes().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Betreuungsarten',
                detail: error,
                life: 5000,
            })
        } else {
            updateSupervisionType(data)
            loadingSupervision.value = false
        }
    })
    initMentoringFilters()

    loadingReduction.value = true
    DiscountTypeService.getDiscountTypes().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Ermäßigungen',
                detail: error,
                life: 5000,
            })
        } else {
            updateDiscountType(data)
            loadingReduction.value = false
        }
    })
    initReductionFilters()
})

const formatNumber = (value: number) => {
    if (value == null) return ''; // Leere Anzeige, falls der Wert null oder undefined ist
    return value.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatBoolean = (value: boolean) => (value ? 'Ja' : 'Nein');
</script>

<template>
    <div class="card">
        <h1 class="text-xl font-semibold">Stammdatenverwaltung</h1>
    </div>
    <div class="card">
        <div class="flex justify-between mb-4">
            <h2 class="mb-4 text-xl font-semibold">Betreuungsart + Multiplikationsfaktor</h2>
            <Button
                label="Neue Betreuungsart anlegen"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNewMentoring"
            />
        </div>
        
        <DataTable
            :value="mentorings"
            :paginator="true"
            :rows="4"
            showGridlines
            size="small"
            data-key="typeOfSupervisionId"
            :row-hover="true"
            filter-display="row"
            :loading="loadingSupervision"
            v-model:filters="filtersMentoring"
            :global-filter-fields="['typeOfSupervision']"
            v-model:editing-rows="editingRowsMentoring"
            editMode="row"
            sortMode="multiple"
            removableSort 
            @row-edit-save="onRowEditSaveMentoring"
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

            <!-- ID Column -->
            <Column field="typeOfSupervisionId" header="ID" style="min-width: 6rem" sortable>
                <template #body="{ data }">{{ data.typeOfSupervisionId }}</template>
            </Column>

            <!-- Mentoring-Name Column -->
            <Column
                field="typeOfSupervision"
                header="Name der Betreuungsart"
                style="min-width: 12rem"
                sortable
            >
                <template #body="{ data }">{{ data.typeOfSupervision }}</template>
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

            <!-- CalculationFactor Column -->
            <Column
                field="calculationFactor"
                header="Multiplikationsfaktor"
                style="min-width: 10rem"
                sortable
            >
                <template #body="{ data }">{{ formatNumber(data.calculationFactor) }}</template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" :step="0.05" :min="0.1" fluid />
                </template>
            </Column>

            <!-- Semester (validFrom) Column -->
            <Column
                field="validFrom"
                header="Gültig seit"
                style="min-width: 10rem"
                sortable
            >
                <template #body="{ data }">{{ getSemesterName(data.validFrom) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="semesterSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>
            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>
        </DataTable>

        <Dialog
            v-model:visible="newMentoringDialog"
            :style="{ width: '450px' }"
            header="Neue Betreuungsart anlegen"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolverMentoring
                :initial-values="getNewMentoringValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateMentoringFormSubmit"
            >
                <!-- Mentoring-Name Field -->
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="typeOfSupervision" name="typeOfSupervision" fluid />
                        <label
                            for="typeOfSupervision"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Name der Betreuungsart</label
                        >
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

                <!-- CalculationFactor Field -->
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputNumber id="calculationFactor" name="calculationFactor" type="number" :step="0.1" :min="0.1" fluid />
                        <label
                            for="calculationFactor"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Multiplikationsfaktor (SWS)</label
                        >
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
                            :options="semesterSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="validFrom"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Gültig ab</label
                        >
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

                <!-- Footer -->
                <div class="flex flex-row">
                    <Button
                        label="Abbrechen"
                        icon="pi pi-times"
                        text
                        @click="hideMentoringDialog"
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

    <div class="grid grid-cols-6 gap-4 ">
        <div class="card mb-0 col-span-3">
            <div class="flex justify-between mb-4">
                <h2 class="mb-4 text-xl font-semibold">Semester</h2>
                <Button
                    label="Neues Semester anlegen"
                    icon="pi pi-plus"
                    class="mr-2"
                    @click="openNewSemester"
                />
            </div>
            <DataTable
                :value="semesters"
                :paginator="true"
                :rows="3"
                size="small"
                showGridlines
                data-key="id"
                :row-hover="true"
                filter-display="row"
                :loading="loadingSemester"
                v-model:filters="filtersSemester"
                :global-filter-fields="['name']"
                v-model:editing-rows="editingRowsSemester"
                editMode="row"
                sortMode="multiple"
                removableSort 
                @row-edit-save="onRowEditSaveSemester"
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

                <!-- ID Column -->
                <Column field="id" header="ID" style="min-width: 6rem" sortable>
                    <template #body="{ data }">{{ data.id }}</template>
                </Column>

                <!-- Semester-Name Column -->
                <Column
                    field="name"
                    header="Name des Semesters"
                    style="min-width: 12rem"
                    sortable
                >
                    <template #body="{ data }">{{ data.name }}</template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" fluid />
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText
                            @input="filterCallback()"
                            v-model="filterModel.value"
                            type="text"
                            placeholder="Semester-Namen suchen"
                        />
                    </template>
                </Column>

                <!-- Akctive Column -->
                <Column
                    field="active"
                    header="Aktiv?"
                    style="min-width: 8rem"
                    sortable
                >
                    <template #body="{ data }">{{ formatBoolean(data.active) }}</template>
                    <template #editor="{ data, field }">
                        <Select v-model="data[field]" :options="booleanOptions" option-label="label" option-value="value" fluid />
                    </template>
                </Column>

                <Column
                    :rowEditor="true"
                    style="width: 10%; min-width: 8rem"
                    bodyStyle="text-align:center"
                ></Column>
            </DataTable>

            <Dialog
                v-model:visible="newSemesterDialog"
                :style="{ width: '450px' }"
                header="Neues Semester anlegen"
                :modal="true"
            >
                <!-- Form inside the dialog -->
                <Form
                    v-slot="$form"
                    :resolverSemester
                    :initial-values="getNewSemesterValues()"
                    class="flex w-full flex-col gap-4"
                    @submit="onCreateSemesterFormSubmit"
                >
                    <!-- Semester-Name Field -->
                    <div class="mt-2 flex flex-col gap-1">
                        <FloatLabel variant="on">
                            <InputText id="name" name="name" fluid />
                            <label
                                for="name"
                                class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                >Name des Semesters</label
                            >
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

                    <!-- Aktiv Field -->
                    <div class="flex flex-col gap-1">
                        <FloatLabel variant="on">
                            <Select
                                label-id="active"
                                name="active"
                                :options="booleanOptions"
                                option-label="label"
                                option-value="value"
                                fluid
                            ></Select>
                            <label
                                for="active"
                                class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                >Aktiv?</label
                            >
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

                    <!-- Footer -->
                    <div class="flex flex-row">
                        <Button
                            label="Abbrechen"
                            icon="pi pi-times"
                            text
                            @click="hideSemesterDialog"
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

        <div class="card col-span-3">
            <div class="flex justify-between mb-4">
                <h2 class="mb-4 text-xl font-semibold">Ermäßigungsarten</h2>
                <Button
                    label="Neue Ermäßigung anlegen"
                    icon="pi pi-plus"
                    class="mr-2"
                    @click="openNewReduction"
                />
            </div>

            <DataTable
            :value="reductions"
            :paginator="true"
            :rows="3"
            size="small"
            showGridlines
            data-key="discountTypeId"
            :row-hover="true"
            filter-display="row"
            :loading="loadingReduction"
            v-model:filters="filtersReduction"
            :global-filter-fields="['discountType']"
            v-model:editing-rows="editingRowsReduction"
            editMode="row"
            sortMode="multiple"
            removableSort 
            @row-edit-save="onRowEditSaveReduction"
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

            <!-- ID Column -->
            <Column field="discountTypeId" header="ID" style="min-width: 6rem" sortable>
                <template #body="{ data }">{{ data.discountTypeId }}</template>
            </Column>

            <!-- Reduction-Name Column -->
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

            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>
        </DataTable>

        <Dialog
            v-model:visible="newReductionDialog"
            :style="{ width: '450px' }"
            header="Neue Ermäßigung anlegen"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolverReduction
                :initial-values="getNewReductionValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateReductionFormSubmit"
            >
                <!-- Semester-Name Field -->
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="discountType" name="discountType" fluid />
                        <label
                            for="discountType"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Name der Ermäßigung</label
                        >
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

                <!-- Footer -->
                <div class="flex flex-row">
                    <Button
                        label="Abbrechen"
                        icon="pi pi-times"
                        text
                        @click="hideReductionDialog"
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
    </div>
</template>