<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, reactive, ref } from 'vue'
import UserService from '@/service/user.service'
import { IUserResponse, ICreateUserRequest } from '@workspace/shared'
import {
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
    useToast,
} from 'primevue'
import { UserRole } from '@workspace/shared'
import {
    getFormStatesAsType,
    getObjectAsSelectOptions,
} from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

const users = ref<IUserResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const editingRows = ref([])
const loading = ref(false)
const toast = useToast()
const roles = reactive(getObjectAsSelectOptions(UserRole))

const updateUsers = (data: IUserResponse[]) => {
    users.value = data.map((d) => {
        d.createdAt = new Date(d.createdAt)
        d.updatedAt = new Date(d.updatedAt)
        return d
    })
}

/**
 * New User Configuration
 */
const newUserSubmitted = ref(false)
const newUserDialog = ref(false)
const newUserSchema = z.object({
    username: z.string().trim().min(5).max(30),
    password: z.string().trim().min(6).max(30),
    isPasswordTemporary: z.boolean(),
    firstName: z.string().trim().min(1).max(30),
    lastName: z.string().trim().min(1).max(30),
    role: z.enum(['TEACHER', 'CONTROLLER']),
})
const resolver = ref(zodResolver(newUserSchema))

const openNew = () => {
    newUserSubmitted.value = false
    newUserDialog.value = true
}

const hideDialog = () => {
    newUserDialog.value = false
    newUserSubmitted.value = false
}

const getNewUserValues = (): z.infer<typeof newUserSchema> => {
    return {
        username: '',
        password: Math.random().toString(36).slice(-8),
        firstName: '',
        lastName: '',
        role: 'TEACHER',
        isPasswordTemporary: true,
    } satisfies ICreateUserRequest
}

const onCreateUserFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newUserSubmitted.value = true
        const newUser = getFormStatesAsType<ICreateUserRequest>(states)
        UserService.createUser(newUser).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                updateUsers([...users.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Nutzer erstellt',
                    life: 3000,
                })
            }
        })

        newUserDialog.value = false
    }
}

const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    UserService.updateUser(newData).then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateUsers(users.value.map((u) => (u.id === data.id ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Nutzer aktualisiert',
                life: 3000,
            })
        }
    })
}

onBeforeMount(() => {
    loading.value = true
    UserService.getUsers().then((res) => {
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
            updateUsers(data)
        }
    })
    initFilters()
})

// Initialize filters
function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
        firstName: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
        lastName: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
        role: {
            value: null,
            matchMode: FilterMatchMode.EQUALS,
        },
        createdAt: {
            value: null,
            matchMode: FilterMatchMode.DATE_IS,
        },
        updatedAt: {
            value: null,
            matchMode: FilterMatchMode.DATE_IS,
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
</script>

<template>
    <div class="card">
        <div class="mb-4 flex justify-between">
            <h1 class="mb-4 text-xl font-semibold">Nutzerverwaltung</h1>
            <Button
                label="Neuer Nutzer"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNew"
            />
        </div>

        <DataTable
            :value="users"
            :paginator="true"
            :rows="10"
            size="small"
            data-key="id"
            :row-hover="true"
            filter-display="row"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="[
                'username',
                'role',
                'firstName',
                'lastName',
            ]"
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
            <!-- Table Header Global Search -->
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
                        <!-- @vue-expect-error -->
                        <InputText
                            v-model="filters['global'].value"
                            placeholder="Globale Suche"
                        />
                    </div>
                </div>
            </template>

            <!-- Empty Table State -->
            <template #empty>Keine Nutzer gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 6rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Username Column -->
            <Column
                field="username"
                header="Nutzername"
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{ data.username }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Nutzername suchen"
                    />
                </template>
            </Column>

            <!-- First Name Column -->
            <Column field="firstName" header="Vorname" style="min-width: 12rem">
                <template #body="{ data }">{{ data.firstName }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Vorname suchen"
                    />
                </template>
            </Column>

            <!-- Last Name Column -->
            <Column field="lastName" header="Nachname" style="min-width: 12rem">
                <template #body="{ data }">{{ data.lastName }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Nachname suchen"
                    />
                </template>
            </Column>

            <!-- Role Column -->
            <Column
                field="role"
                header="Rolle"
                style="min-width: 10rem"
                filter-field="role"
                :show-filter-menu="false"
            >
                <template #body="{ data }">{{ data.role }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <Select
                        @change="filterCallback()"
                        v-model="filterModel.value"
                        :options="roles"
                        option-label="label"
                        option-value="value"
                        placeholder="Rolle auswählen"
                        show-clear
                    >
                    </Select>
                </template>
            </Column>

            <!-- Created At Column -->
            <Column
                field="createdAt"
                header="Erstellt am"
                data-type="date"
                style="min-width: 12rem"
                sortable
            >
                <template #body="{ data }">{{
                    formatDate(data.createdAt)
                }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <DatePicker
                        @date-select="filterCallback()"
                        v-model="filterModel.value"
                        date-format="dd.mm.yy"
                        placeholder="Datum auswählen"
                    />
                </template>
            </Column>

            <!-- Updated At Column -->
            <Column
                field="updatedAt"
                header="Aktualisiert am"
                data-type="date"
                style="min-width: 12rem"
                sortable
            >
                <template #body="{ data }">{{
                    formatDate(data.updatedAt)
                }}</template>
                <template #filter="{ filterModel, filterCallback }">
                    <DatePicker
                        @date-select="filterCallback()"
                        v-model="filterModel.value"
                        date-format="dd.mm.yy"
                        placeholder="Datum auswählen"
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
            v-model:visible="newUserDialog"
            :style="{ width: '450px' }"
            header="Neuer Nutzer - Details"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolver
                :initial-values="getNewUserValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateUserFormSubmit"
            >
                <!-- Username Field -->
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="username" name="username" fluid />
                        <label
                            for="username"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Nutzername</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.username?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.username.error?.message }}
                    </Message>
                </div>

                <!-- Password Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Password
                            id="password"
                            name="password"
                            fluid
                            toggle-mask
                            :feedback="false"
                        />
                        <label
                            for="password"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Initiales Passwort</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.password?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.password.error?.message }}
                    </Message>
                </div>

                <!-- First Name Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="firstName" name="firstName" fluid />
                        <label
                            for="firstName"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Vorname</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.firstName?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.firstName.error?.message }}
                    </Message>
                </div>

                <!-- Last Name Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="lastName" name="lastName" fluid />
                        <label
                            for="lastName"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Nachname</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.lastName?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.lastName.error?.message }}
                    </Message>
                </div>

                <!-- Role Selection -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="role-select"
                            name="role"
                            :options="roles"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="role-select"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Rolle</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.role?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.role.error?.message }}
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
