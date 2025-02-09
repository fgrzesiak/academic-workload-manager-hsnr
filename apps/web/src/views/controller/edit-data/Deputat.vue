<script setup lang="ts">
// import of required modules, libraries and services
import { onBeforeMount, ref } from 'vue'
import TeachingDutyService from '@/service/teachingDuty.service'
import SemesterService from '@/service/semester.service'
import TeacherService from '@/service/teacher.service'
import {
    ITeachingDutyResponse,
    ISemesterResponse,
    ITeacherResponse,
} from '@workspace/shared'
import { DataTableRowEditSaveEvent, useToast } from 'primevue'

// interface for defining dropdown options
interface SelectOption {
    label: string
    value: number
}

// reactive variables for saving deputats, filter criteria and UI states
const deputats = ref<ITeachingDutyResponse[]>([])
const editingRows = ref([])
const loading = ref(false)
const toast = useToast()
const semesterSelect = ref<SelectOption[]>([])
const userSelect = ref<SelectOption[]>([])
const expandedRowGroups = ref<number[]>([])

// updates the list within the tabular display of the deputats with new data
const updateTeachingDuties = (data: ITeachingDutyResponse[]) => {
    deputats.value = data.sort((a, b) => a.teacherId - b.teacherId)
}

// deletes a deputat based on its ID
// const deleteEntry = (id: number) => {
//     try {
//         TeachingDutyService.deleteTeachingDuty(id)

//         toast.add({
//             severity: 'success',
//             summary: 'Erfolgreich',
//             detail: 'Deputat gelöscht',
//             life: 3000,
//         })

//         deputats.value = deputats.value.filter(
//             (event) => event.id !== id
//         )
//     } catch (error) {
//         toast.add({
//             severity: 'error',
//             summary: 'Fehler',
//             detail: error,
//             life: 5000,
//         })
//     }
// }

// saves changes to a deputat
const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    TeachingDutyService.updateTeachingDuty(newData).then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateTeachingDuties(
                deputats.value.map((u) => (u.id === data.id ? data : u))
            )
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Deputat aktualisiert',
                life: 3000,
            })
        }
    })
}

// loads initial data from the table for deputats, semesters and lecturers
onBeforeMount(() => {
    loading.value = true

    // loads deputats
    TeachingDutyService.getTeachingDuties().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Deputate',
                detail: error,
                life: 5000,
            })
        } else {
            deputats.value = data.sort((a, b) => a.teacherId - b.teacherId)
        }
    })

    // loads semesters
    SemesterService.getSemesters().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn('[Deputat-Overview] Couldn`t load semster')
        } else {
            semesterSelect.value = data.map((semester: ISemesterResponse) => ({
                label: semester.name,
                value: semester.id,
            }))
        }
    })

    // loads teachers
    TeacherService.getTeachers().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn('[Deputat-Overview] Couldn`t load teachers')
        } else {
            userSelect.value = data.map((teacher: ITeacherResponse) => ({
                label: teacher.user.firstName + ' ' + teacher.user.lastName,
                value: teacher.id,
            }))
        }
    })

    loading.value = false
})

// converts semester IDs into names
const getSemesterName = (id: number) => {
    const semester = semesterSelect.value.find((s) => s.value === id)
    return semester ? semester.label : 'Unbekannt'
}

// converts user IDs to names
const getUserName = (id: number) => {
    const user = userSelect.value.find((s) => s.value === id)
    return user ? user.label : 'Unbekannt'
}

// formats numbers with one decimal place
const formatNumber = (value: number) => {
    if (value == null) return '' // Leere Anzeige, falls der Wert null oder undefined ist
    return value.toLocaleString('de-DE', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
}
</script>

<template>
    <div class="card">
        <div class="mb-4 flex justify-between">
            <h1 class="mb-4 text-xl font-semibold">
                Übersicht der gemeldeten Deputate
            </h1>
        </div>

        <!-- table to display the data -->
        <DataTable
            :value="deputats"
            size="small"
            data-key="id"
            showGridlines
            scrollable
            scrollHeight="70vh"
            v-model:expandedRowGroups="expandedRowGroups"
            expandableRowGroups
            rowGroupMode="subheader"
            groupRowsBy="teacherId"
            :row-hover="true"
            :loading="loading"
            v-model:editing-rows="editingRows"
            editMode="row"
            @row-edit-save="onRowEditSave"
        >
            <!-- Empty Table State -->
            <template #empty>Keine Deputate gefunden.</template>

            <!-- Group Header -->
            <template #groupheader="{ data }">
                <span class="ml-2 align-middle font-bold leading-normal">{{
                    getUserName(data.teacherId)
                }}</span>
            </template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Semester Column -->
            <Column
                field="semesterPeriodId"
                header="Semester"
                style="min-width: 8rem"
                sortable
            >
                <template #body="{ data }">{{
                    getSemesterName(data.semesterPeriodId)
                }}</template>
                <template #editor="{ data, field }">
                    <Select
                        v-model="data[field]"
                        :options="semesterSelect"
                        option-label="label"
                        option-value="value"
                        fluid
                    />
                </template>
            </Column>

            <!-- SWS Column -->
            <Column field="individualDuty" header="SWS" style="min-width: 6rem">
                <template #body="{ data }">{{
                    formatNumber(data.individualDuty)
                }}</template>
                <template #editor="{ data, field }">
                    <InputNumber
                        v-model="data[field]"
                        fluid
                        style="max-width: 6rem"
                        :step="1"
                        :min="0"
                        :min-fraction-digits="2"
                        :max-fraction-digits="2"
                        :show-buttons="true"
                    />
                </template>
            </Column>

            <!-- edit data -->
            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>

            <!-- delete data -->
            <!-- <Column
                style="width: 4rem; text-align: center"
                :headerStyle="{ textAlign: 'center' }"
            >
                <template #body="{ data }">
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-danger"
                        @click="deleteEntry(data.id)"
                    />
                </template>
            </Column> -->
        </DataTable>
    </div>
</template>
