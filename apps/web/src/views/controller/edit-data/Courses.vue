<script setup lang="ts">
// import of required modules, libraries and services
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, ref } from 'vue'
import TeachingEventService from '@/service/teachingEvent.service'
import { ITeachingEventResponse, ICreateTeachingEventRequest } from '@workspace/shared'
import SemesterService from '@/service/semester.service'
import { ISemesterResponse, ITeacherResponse, ICommentResponse } from '@workspace/shared'
import TeacherService from '@/service/teacher.service'
import CommentService from '@/service/comment.service'
import {
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
    useToast,
} from 'primevue'
import { getFormStatesAsType } from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

// interface for defining dropdown options
interface SelectOption {
    label: string;
    value: number;
}

// definition of selection options for yes/no
const booleanOptions = ref([
    { label: 'Ja', value: true },
    { label: 'Nein', value: false },
]);

// reactive variables for saving courses, filter criteria and UI states
const teachingEvents = ref<ITeachingEventResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const editingRows = ref([])
const loading = ref(false)
const toast = useToast()
const semesterSelect = ref<SelectOption[]>([])
const userSelect = ref<SelectOption[]>([])
const expandedRowGroups = ref<number[]>([])

// updates the list within the tabular display of the courses with new data
const updateTeachingEvents = (data: ITeachingEventResponse[]) => {
    teachingEvents.value = data.map((d) => { 
        return d 
    })
}

// variables and schema for creating a new course
const newTeachingEventSubmitted = ref(false)
const newTeachingEventDialog = ref(false)
const newTeachingEventSchema = z.object({
    name: z.string().trim().min(10).max(255),
    semesterPeriodId: z.number(),
    ordered: z.boolean(),
    hours: z.number(),
    programId: z.number(),
    teacherId: z.number(),
    commentId: z.number(),
})
const resolver = ref(zodResolver(newTeachingEventSchema))

// comment overlay condition and content
const currentCommentContent = ref("")
const currentCommentDate = ref("")
const commentDrawerVisible = ref(false)

// opens the dialog for adding a new course
const openNew = () => {
    newTeachingEventSubmitted.value = false
    newTeachingEventDialog.value = true
}

// closes the dialog of the course creation without action
const hideDialog = () => {
    newTeachingEventDialog.value = false
    newTeachingEventSubmitted.value = false
}

// deletes a course based on its ID
const deleteEntry = (id: number) => {
    try {
        TeachingEventService.deleteTeachingEvent(id);

        toast.add({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: 'Lehrveranstaltung gelöscht',
            life: 3000,
        })
            
        teachingEvents.value = teachingEvents.value.filter(event => event.id !== id);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Fehler',
            detail: error,
            life: 5000,
        })
    }
}

// Initializes the values for a new course
const getNewTeachingEventValues = (): z.infer<typeof newTeachingEventSchema> => {
    return {
        name: '',
        semesterPeriodId: 0,
        ordered: false,
        hours: 0,
        programId: 0,
        teacherId: 0,
        commentId: 0,
    } satisfies ICreateTeachingEventRequest
}

// submit handler for the form for creating a new course
const onCreateTeachingEventFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newTeachingEventSubmitted.value = true
        const newTeachingEvent = getFormStatesAsType<ICreateTeachingEventRequest>(states)
        // newTeachingEvent.programId = null
        TeachingEventService.createTeachingEvent(newTeachingEvent).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                updateTeachingEvents([...teachingEvents.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Lehrveranstaltung erstellt',
                    life: 3000,
                })
            }
        })

        newTeachingEventDialog.value = false
    }
}

// saves changes to a course
const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    TeachingEventService.updateTeachingEvent(newData).then((res) => {
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
            updateTeachingEvents(teachingEvents.value.map((u) => (u.id === data.id ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Lehrveranstaltung aktualisiert',
                life: 3000,
            })
        }
    })
}

// loads initial data from the table for courses, semesters and lecturers
onBeforeMount(() => {
    loading.value = true

    // loads courses
    TeachingEventService.getTeachingEvents().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateTeachingEvents(data)
        }
    })

    // loads semesters
    SemesterService.getSemesters().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Course-Overview] Couldn`t load semster")
        } else {
            semesterSelect.value = data.map((semester: ISemesterResponse) => ({
                label: semester.name,
                value: semester.id,
            }));
        }
    })

    // loads teachers
    TeacherService.getTeachers().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Course-Overview] Couldn`t load teachers")
        } else {
            userSelect.value = data.map((teacher: ITeacherResponse) => ({
                label: teacher.firstName + " " + teacher.lastName,
                value: teacher.id,
            }));
        }
    })

    initFilters()
    loading.value = false
})

// initializes default filter settings
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

// displays a comment based on the ID
const showComment = async (commentId: number) => {
    const commentData = await fetchCommentById(commentId);
    currentCommentContent.value = commentData ? commentData.commentContent : "Kein Inhalt.";
    currentCommentDate.value = commentData ? formatDate(commentData.commentDate.toString()) : "Kein Datum.";
    commentDrawerVisible.value = true;
};

// loads a comment based on the ID
const fetchCommentById = async (commentId: number): Promise<ICommentResponse | null> => {
    try {
        const res = await CommentService.getComments();
        const { data, error } = res;

        if (error) {
            console.log("Error Laden von Comments");
            return null;
        }

        const response = data.find((item) => item.commentId === commentId);
        return response || null;
    } catch (e) {
        console.error("Ein Fehler ist aufgetreten:", e);
        return null;
    }
};

// handling the group extension (grouped display in the table)
const onRowGroupExpand = (event: any) => {
    const customEvent = event as { group: number; data: any[] };
    const groupId = customEvent.group;
    if (!expandedRowGroups.value.includes(groupId)) {
        expandedRowGroups.value.push(groupId);
    }
};

// handling the group closure
const onRowGroupCollapse = (event: any) => {
    const customEvent = event as { group: number; data: any[] };
    const groupId = customEvent.group;
    expandedRowGroups.value = expandedRowGroups.value.filter(id => id !== groupId);
};

// closes the comment overlay
const closeCommentDrawer = () => {
    commentDrawerVisible.value = false;
    currentCommentContent.value = "";
    currentCommentDate.value = "";
};

// formats a date in “dd.mm.yyyy” format
const formatDate = (value: string) => {
    if (!value) return '';
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// converts semester IDs into names
const getSemesterName = (id: number) => {
    const semester = semesterSelect.value.find((s) => s.value === id);
    return semester ? semester.label : 'Unbekannt';
};

// converts user IDs to names
const getUserName = (id: number) => {
    const user = userSelect.value.find((s) => s.value === id);
    return user ? user.label : 'Unbekannt';
};

// formats numbers with one decimal place
const formatNumber = (value: number) => {
    if (value == null) return ''; // Leere Anzeige, falls der Wert null oder undefined ist
    return value.toLocaleString('de-DE', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
};

// converts a boolean value to Yes/No
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

        <!-- table to display the data -->
        <DataTable
            :value="teachingEvents"
            size="small"
            data-key="id"
            showGridlines
            scrollable
            scrollHeight="70vh"
            v-model:expandedRowGroups="expandedRowGroups"
            expandableRowGroups
            @rowgroup-expand="onRowGroupExpand" 
            @rowgroup-collapse="onRowGroupCollapse"
            rowGroupMode="subheader" 
            groupRowsBy="teacherId"
            :row-hover="true"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="['name']"
            v-model:editing-rows="editingRows"
            editMode="row"
            sortMode="multiple"
            removableSort 
            @row-edit-save="onRowEditSave"
        >
            <!-- grouping the data by teacher -->
            <template #groupheader="{ data }">
                <span class="align-middle ml-2 font-bold leading-normal">{{ getUserName(data.teacherId) }}</span>
            </template>
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
            <template #empty>Keine Lehrveranstaltungen gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Name Column -->
            <Column
                field="name"
                header="Name"
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.name }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>

            <!-- Semester Column -->
            <Column
                field="semesterPeriodId"
                header="Semester"
                style="min-width: 8rem"
                sortable
            >
                <template #body="{ data }">{{ getSemesterName(data.semesterPeriodId) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="semesterSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- Hours Column -->
            <Column
                field="hours"
                header="SWS"
                style="min-width: 6rem"
            >
                <template #body="{ data }">{{ formatNumber(data.hours) }}</template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" fluid style="max-width: 6rem" :step="0.1" :min="0" />
                </template>
            </Column>

            <!-- ProgramId Column -->

            <!-- Ordered Column -->
            <Column
                field="ordered"
                header="Angeordnet?"
                style="min-width: 8rem"
                sortable
            >
                <template #body="{ data }">{{ formatBoolean(data.ordered) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="booleanOptions" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- edit data -->
            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>

            <!-- show comment -->
            <Column
            style="width: 4rem; text-align: center"
            :headerStyle="{ textAlign: 'center' }"
            >
                <template #body="{ data }">
                    <Button
                        v-if="data.commentId > 0"
                        icon="pi pi-comments"
                        class="p-button-secondary"
                        @click="showComment(data.commentId)"
                    />
                </template>
            </Column>

            <!-- delete data -->
            <Column
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
            </Column>            
        </DataTable>

        <!-- comment overlay -->
        <Drawer v-model:visible="commentDrawerVisible" header="Kommentar" position="right">
            <div class="flex flex-wrap flex-col gap-4">
                <p>Kommentar vom: {{currentCommentDate}}</p>
                <Textarea
                v-model="currentCommentContent"
                id="comment"
                rows="8"
                readonly
                />
                <Button
                label="Schließen"
                class="p-button-secondary"
                icon="pi pi-times"
                @click="closeCommentDrawer"
                />
            </div>
        </Drawer>

        <!-- add new course -->
        <Dialog
            v-model:visible="newTeachingEventDialog"
            :style="{ width: '450px' }"
            header="Neue Lehrveranstaltung"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolver
                :initial-values="getNewTeachingEventValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateTeachingEventFormSubmit"
            >
                <!-- Name Field -->
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="name" name="name" fluid />
                        <label
                            for="name"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Name der Lehrveranstaltung</label
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

                <!-- Hours Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputNumber id="hours" name="hours" :min="0" fluid />
                        <label
                            for="hours"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Anzahl der SWS</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.hours?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.hours.error?.message }}
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

                <!-- Ordered Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="ordered"
                            name="ordered"
                            :options="booleanOptions"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="ordered"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Angeordnet?</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.ordered?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.ordered.error?.message }}
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
