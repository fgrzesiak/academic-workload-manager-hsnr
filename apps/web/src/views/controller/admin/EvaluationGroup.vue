<script setup lang="ts">
// import of required modules, libraries and services
import { onBeforeMount, ref } from 'vue'
import TeachingGroupService from '@/service/teachingGroup.service'
import {
    ITeachingGroupResponse,
    ICreateTeachingGroupRequest,
} from '@workspace/shared'
import { DataTableRowEditSaveEvent, useToast } from 'primevue'
import { getFormStatesAsType } from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

// reactive variables for saving teaching groups, filter criteria and UI states
const teachingGroup = ref<ITeachingGroupResponse[]>([])
const editingRows = ref([])
const loading = ref(false)
const toast = useToast()

const newTeachingGroupSubmitted = ref(false)
const newTeachingGroupDialog = ref(false)
const newTeachingGroupSchema = z.object({
    groupName: z.string().trim().min(5).max(255),
    groupDescription: z.string().trim().min(10).max(255),
    groupBalance: z.number(),
})
const resolver = ref(zodResolver(newTeachingGroupSchema))

const openNew = () => {
    newTeachingGroupSubmitted.value = false
    newTeachingGroupDialog.value = true
}

const hideDialog = () => {
    newTeachingGroupDialog.value = false
    newTeachingGroupSubmitted.value = false
}

// updates the list within the tabular display of the teaching groups with new data
const updateTeachingGroups = (data: ITeachingGroupResponse[]) => {
    teachingGroup.value = data.map((d) => {
        return d
    })
}

const getNewTeachingGroupValues = (): z.infer<
    typeof newTeachingGroupSchema
> => {
    return {
        groupName: 'Gruppe_',
        groupDescription: '',
        groupBalance: 0,
    } satisfies ICreateTeachingGroupRequest
}

//create new teaching group from dialog
const onCreateTeachingGroupFormSubmit = async ({
    valid,
    states,
}: FormSubmitEvent) => {
    if (valid) {
        newTeachingGroupSubmitted.value = true
        const newTeachingGroup =
            getFormStatesAsType<ICreateTeachingGroupRequest>(states)
        newTeachingGroup.groupBalance = 0
        TeachingGroupService.createTeachingGroup(newTeachingGroup).then(
            (res) => {
                const { data, error } = res
                if (error) {
                    toast.add({
                        severity: 'error',
                        summary: 'Fehler',
                        detail: error,
                        life: 5000,
                    })
                } else {
                    updateTeachingGroups([...teachingGroup.value, data])
                    toast.add({
                        severity: 'success',
                        summary: 'Erfolgreich',
                        detail: 'Ermäßigung erstellt',
                        life: 3000,
                    })
                }
            }
        )

        newTeachingGroupDialog.value = false
    }
}

// saves changes to a deputat
const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    TeachingGroupService.updateTeachingGroup(newData).then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateTeachingGroups(
                teachingGroup.value.map((u) => (u.id === data.id ? data : u))
            )
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Lehrgruppe aktualisiert',
                life: 3000,
            })
        }
    })
}

// loads initial data from the table for teaching groups, semesters and lecturers
onBeforeMount(() => {
    loading.value = true

    // loads teaching groups
    TeachingGroupService.getTeachingGroups().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Lehrgruppen',
                detail: error,
                life: 5000,
            })
        } else {
            teachingGroup.value = data.map(
                (deputat: ITeachingGroupResponse) => deputat
            )
        }
    })

    loading.value = false
})
</script>

<template>
    <div class="card">
        <div class="mb-4 flex justify-between">
            <h1 class="mb-4 text-xl font-semibold">
                Übersicht der Lehrenden-Gruppen für den Export
            </h1>
            <Button
                label="Neue Lehrgruppe anlegen"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNew"
            />
        </div>

        <!-- table to display the data -->
        <DataTable
            :value="teachingGroup"
            size="small"
            data-key="id"
            showGridlines
            scrollable
            scrollHeight="70vh"
            :row-hover="true"
            :loading="loading"
            v-model:editing-rows="editingRows"
            editMode="row"
            @row-edit-save="onRowEditSave"
        >
            <!-- Empty Table State -->
            <template #empty>Keine Lehrgruppen gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Name Column -->
            <Column field="groupName" header="Name" style="min-width: 3rem">
                <template #body="{ data }">{{ data.groupName }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>

            <!-- Description Column -->
            <Column
                field="groupDescription"
                header="Beschreibung"
                style="min-width: 15rem"
            >
                <template #body="{ data }">{{
                    data.groupDescription
                }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>

            <!-- edit data -->
            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>
        </DataTable>

        <Dialog
            v-model:visible="newTeachingGroupDialog"
            :style="{ width: '450px' }"
            header="Neue Betreuung"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolver
                :initial-values="getNewTeachingGroupValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateTeachingGroupFormSubmit"
            >
                <!-- Name Field -->
                <!-- Description Field -->
                <div class="mt-4 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="groupName" name="groupName" fluid />
                        <label
                            for="groupName"
                            class="block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Name der Gruppe</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.groupName?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.groupName.error?.message }}
                    </Message>
                </div>

                <!-- Description Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText
                            id="groupDescription"
                            name="groupDescription"
                            fluid
                        />
                        <label
                            for="groupDescription"
                            class="block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Beschreibung der Gruppe</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.groupDescription?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.groupDescription.error?.message }}
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
