<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, ref } from 'vue'
import SupervisionService from '@/service/supervision.service'
import { ISupervisionResponse, ICreateSupervisionRequest } from '@workspace/shared'
import SupervisionTypeService from '@/service/supervisionType.service'
import SemesterService from '@/service/semester.service'
import UserService from '@/service/user.service'
import { ISupervisionTypeResponse, ISemesterResponse, IUserResponse } from '@workspace/shared'
import {
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
    useToast,
} from 'primevue'
import { getFormStatesAsType } from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

interface SelectOption {
    label: string;
    value: number;
}

const booleanOptions = ref([
    { label: 'Ja', value: true },
    { label: 'Nein', value: false },
]);

const teachingEvents = ref<ISupervisionResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const editingRows = ref([])
const loading = ref(false)
const toast = useToast()
const typeSelect = ref<SelectOption[]>([])
const semesterSelect = ref<SelectOption[]>([])
const userSelect = ref<SelectOption[]>([])

const updateSupervisions = (data: ISupervisionResponse[]) => {
    teachingEvents.value = data.map((d) => { 
        return d 
    })
}

/**
 * New Supervision Configuration
 */
const newSupervisionSubmitted = ref(false)
const newSupervisionDialog = ref(false)
const newSupervisionSchema = z.object({
    studentId: z.number(),
    semesterPeriodId: z.number(),
    supervisionTypeId: z.number(),
    teacherId: z.number(),
    commentId: z.number(),
})
const resolver = ref(zodResolver(newSupervisionSchema))

const openNew = () => {
    newSupervisionSubmitted.value = false
    newSupervisionDialog.value = true
}

const hideDialog = () => {
    newSupervisionDialog.value = false
    newSupervisionSubmitted.value = false
}

const getNewSupervisionValues = (): z.infer<typeof newSupervisionSchema> => {
    return {
        studentId: 0,
        semesterPeriodId: 0,
        supervisionTypeId: 0,
        teacherId: 0,
        commentId: 0,
    } satisfies ICreateSupervisionRequest
}

const onCreateSupervisionFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newSupervisionSubmitted.value = true
        const newSupervision = getFormStatesAsType<ICreateSupervisionRequest>(states)
        // newSupervision.programId = null
        SupervisionService.createSupervision(newSupervision).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                updateSupervisions([...teachingEvents.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Lehrveranstaltung erstellt',
                    life: 3000,
                })
            }
        })

        newSupervisionDialog.value = false
    }
}

const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    SupervisionService.updateSupervision(newData).then((res) => {
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
            updateSupervisions(teachingEvents.value.map((u) => (u.id === data.id ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Lehrveranstaltung aktualisiert',
                life: 3000,
            })
        }
    })
}

onBeforeMount(() => {
    loading.value = true
    SupervisionService.getSupervisions().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateSupervisions(data)
        }
    })

    SupervisionTypeService.getSupervisionTypes().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Mentoring-Overview] Couldn`t load semster")
        } else {
            typeSelect.value = data.map((supervisionType: ISupervisionTypeResponse) => ({
                label: supervisionType.typeOfSupervision,
                value: supervisionType.typeOfSupervisionId,
            }));
        }
    })

    SemesterService.getSemesters().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Mentoring-Overview] Couldn`t load semster")
        } else {
            semesterSelect.value = data.map((semester: ISemesterResponse) => ({
                label: semester.name,
                value: semester.id,
            }));
        }
    })

    UserService.getUsers().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Mentoring-Overview] Couldn`t load users")
        } else {
            userSelect.value = data
            .filter((user: IUserResponse) => user.role === "TEACHER")
            .map((user: IUserResponse) => ({
                label: user.username,
                value: user.id,
            }));
        }
    })

    initFilters()
    loading.value = false
})

// Initialize filters
function initFilters() {
    filters.value = {
        global: { 
            value: null, 
            matchMode: FilterMatchMode.CONTAINS ,
        },
        name: {
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

const getUserName = (id: number) => {
    const user = userSelect.value.find((s) => s.value === id);
    return user ? user.label : 'Unbekannt';
};

const getTypeName = (id: number) => {
    const type = typeSelect.value.find((s) => s.value === id);
    return type ? type.label : 'Unbekannt';
};

const formatBoolean = (value: boolean) => (value ? 'Ja' : 'Nein');
</script>

<template>
    <div class="card">
        <div class="flex justify-between mb-4">
            <h1 class="mb-4 text-xl font-semibold">Übersicht der Lehrveranstaltungen</h1>
            <Button
                label="Neue Lehrveranstaltung"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNew"
            />
        </div>

        <DataTable
            :value="teachingEvents"
            :paginator="true"
            :rows="10"
            data-key="id"
            :row-hover="true"
            filter-display="row"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="['name']"
            v-model:editing-rows="editingRows"
            editMode="row"
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
            <!-- Table Header -->
            <template #header>
                <div class="flex justify-between">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Filter aufheben"
                        outlined
                        @click="initFilters"
                    />
                    <div class="flex items-center gap-2">
                        <i class="pi pi-search" />
                        <!-- @vue-ignore -->
                        <InputText
                            v-model="filters['global'].value"
                            placeholder="Suche"
                        />
                    </div>
                </div>
            </template>

            <!-- Empty Table State -->
            <template #empty>Keine Betreuungen gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- SupervisionType Column -->
            <Column
                field="supervisionTypeId"
                header="Art der Betreuung"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ getTypeName(data.supervisionTypeId) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="typeSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- Matricelnumber Column -->
            <Column
                field="studentId"
                header="Matrikelnummer"
                style="min-width: 6rem"
            >
                <template #body="{ data }">{{ data.studentId }}</template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" fluid :min="0" />
                </template>
            </Column>

            <!-- Semester Column -->
            <Column
                field="semesterPeriodId"
                header="Semester"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ getSemesterName(data.semesterPeriodId) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="semesterSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- Teacher Column -->
            <Column
                field="teacherId"
                header="Lehrperson"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ getUserName(data.teacherId) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="userSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

        </DataTable>

        <Dialog
            v-model:visible="newSupervisionDialog"
            :style="{ width: '450px' }"
            header="Neue Betreuung"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolver
                :initial-values="getNewSupervisionValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateSupervisionFormSubmit"
            >

                <!-- SupervisionType Field -->
                <div class="flex flex-col gap-1 pt-2">
                    <FloatLabel variant="on">
                        <Select
                            label-id="supervisionTypeId"
                            name="supervisionTypeId"
                            :options="typeSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="supervisionTypeId"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Art der Betreuung</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.supervisionTypeId?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.supervisionTypeId.error?.message }}
                    </Message>
                </div>

                
                <!-- Matricelnumber Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputNumber id="studentId" name="studentId" :min="0" fluid />
                        <label
                            for="studentId"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Matrikelnummer</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.studentId?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.studentId.error?.message }}
                    </Message>
                </div>

                <!-- Semester Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="semesterPeriodId"
                            name="semesterPeriodId"
                            :options="semesterSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="semesterPeriodId"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Semester</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.semesterPeriodId?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.semesterPeriodId.error?.message }}
                    </Message>
                </div>

                <!-- Teacher Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="teacherId"
                            name="teacherId"
                            :options="userSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="teacherId"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Lehrperson</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.teacherId?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.teacherId.error?.message }}
                    </Message>
                </div>

                <!-- Footer -->
                <div class="flex flex-row">
                    <Button
                        label="Abbrechen"
                        icon="pi pi-times"
                        text
                        @click="hideDialog"
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
