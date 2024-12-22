<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, reactive, ref } from 'vue'
import SemesterService from '@/service/semester.service'
import { ISemesterResponse, ICreateSemesterRequest } from '@workspace/shared'
import {
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
    useToast,
} from 'primevue'
// import { UserRole } from '@workspace/shared'
import {
    getFormStatesAsType,
    getObjectAsSelectOptions,
} from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

const loading = ref(false)
const toast = useToast()
// const roles = reactive(getObjectAsSelectOptions(UserRole))

/**
 * New Semester Configuration
 */
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
        active: true,
    } satisfies ICreateSemesterRequest
}

const onCreateSemesterFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newSemesterSubmitted.value = true
        const newSemester = getFormStatesAsType<ICreateSemesterRequest>(states)
        newSemester.active = true
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


/**
 * New Mentoring Configuration
 */
// const mentorings = ref<ISemesterResponse[]>([])
const mentorings = ref([])
const filtersMentoring = ref<DataTableFilterMeta>({})
const editingRowsMentoring = ref([])
const newMentoringSubmitted = ref(false)
const newMentoringDialog = ref(false)
const newMentoringSchema = z.object({
    name: z.string().trim().min(10).max(30),
    factor: z.number(),
    valid: z.string()
})
const resolverMentoring = ref(zodResolver(newSemesterSchema))

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
        name: '',
        factor: 0,
        valid: '',
    }
    // } satisfies ICreateSemesterRequest
}

const onCreateMentoringFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        // newMentoringSubmitted.value = true
        // const newMentoring = getFormStatesAsType<ICreateSemesterRequest>(states)
        // SemesterService.createSemester(newMentoring).then((res) => {
        //     const { data, error } = res
        //     if (error) {
        //         toast.add({
        //             severity: 'error',
        //             summary: 'Fehler',
        //             detail: error,
        //             life: 5000,
        //         })
        //     } else {
        //         // updateSemester([...semesters.value, data])
        //         toast.add({
        //             severity: 'success',
        //             summary: 'Erfolgreich',
        //             detail: 'Semester erstellt',
        //             life: 3000,
        //         })
        //     }
        // })

        newMentoringDialog.value = false
    }
}

const onRowEditSaveMentoring = ({ newData }: DataTableRowEditSaveEvent) => {
    // SemesterService.updateSemester(newData).then((res) => {
    //     const { data, error } = res
    //     if (error) {
    //         toast.add({
    //             severity: 'error',
    //             summary: 'Fehler',
    //             detail: error,
    //             life: 5000,
    //         })
    //     } else {
    //         data
    //         // updateSemester(semesters.value.map((u) => (u.id === data.id ? data : u)))
    //         toast.add({
    //             severity: 'success',
    //             summary: 'Erfolgreich',
    //             detail: 'Semester aktualisiert',
    //             life: 3000,
    //         })
    //     }
    // })
}

// Initialize filters
function initMentoringFilters() {
    filtersSemester.value = {
        // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
        valid: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
    }
}
// Utility to format dates
function formatDate(value: Date) {
    return value.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

onBeforeMount(() => {
    loading.value = true
    SemesterService.getSemesters().then((res) => {
        loading.value = false
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateSemester(data)
        }
    })
    initSemesterFilters()
    initMentoringFilters()
})
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
        
        <!-- Hier Data-Table einfügen -->

        <table style="border-collapse: collapse; width: 100%; border: 2px solid #333;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">ID</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Art der Betreuung</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Multiplikationsfaktor</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Gültig ab</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Bachelor</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS24</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Master</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS24</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">3</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Zweitprüfer</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,1</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS20</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">4</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Praxissemester</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS20</td>
                    </tr>
                </tbody>
            </table>
    </div>
    <div class="grid grid-cols-7 gap-4 ">
        <div class="card mb-0 col-span-4">
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
                :rows="5"
                data-key="id"
                :row-hover="true"
                filter-display="row"
                :loading="loading"
                v-model:filters="filtersSemester"
                :global-filter-fields="['name']"
                v-model:editing-rows="editingRowsSemester"
                editMode="row"
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

                <!-- Aktiv Column -->
                <Column
                    field="active"
                    header="Aktiv?"
                    style="min-width: 10rem"
                >
                    <template #body="{ data }">{{ data.active }}</template>
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
            <h2 class="mb-4 text-l font-semibold">Ermäßigungsarten</h2>
            <table style="border-collapse: collapse; width: 100%; border: 2px solid #333;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">ID</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Art der Ermäßigung</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Funktion/Aufgabe</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Forschung/Entwicklung</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">3</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Gesetzlich</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>