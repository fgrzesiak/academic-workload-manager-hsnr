<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, reactive, ref } from 'vue'
import UserService from '@/service/user.service'
import { IUserResponse, ICreateUserRequest } from '@workspace/shared'
import { DataTableFilterMeta, useToast } from 'primevue'
import { UserRole } from '@workspace/shared'
import { getObjectAsSelectOptions } from '@/helpers/functions'

const users = ref<IUserResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const loading = ref(false)
const toast = useToast()
const roles = reactive(getObjectAsSelectOptions(UserRole))

/**
 * Updates the `users` reactive variable with data from the server.
 * Converts the `createdAt` and `updatedAt` fields (date fields) of each user response object to JavaScript Date objects.
 *
 * @param data - Array of user objects fetched from the server.
 * @returns
 */
const updateUsers = (data: IUserResponse[]) => {
    users.value = data.map((d) => {
        d.createdAt = new Date(d.createdAt)
        d.updatedAt = new Date(d.updatedAt)
        return d
    })
}

const createInitialPassword = () => {
    return Math.random().toString(36).slice(-8)
}

const newUserRole = ref(roles[0])

const getNewUser = (): ICreateUserRequest => {
    return {
        username: '',
        role: 'TEACHER',
        password: createInitialPassword(),
        firstName: '',
        lastName: '',
    }
}

/**
 * CRUD User Operations
 */
const newUser = ref<ICreateUserRequest>(getNewUser())
const newUserSubmitted = ref(false)
const newUserDialog = ref(false)

const openNew = () => {
    newUser.value = getNewUser()
    newUserSubmitted.value = false
    newUserDialog.value = true
}

const hideDialog = () => {
    newUserDialog.value = false
    newUserSubmitted.value = false
}
const saveNewUser = () => {
    newUserSubmitted.value = true
    newUser.value.role = newUserRole.value.value as ICreateUserRequest['role']

    if (newUser.value.username.trim()) {
        UserService.createUser(newUser.value).then((res) => {
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
        newUser.value = getNewUser()
    }
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
        <div class="mb-4 text-xl font-semibold">Nutzerverwaltung</div>
        <Toolbar class="mb-6">
            <template #start>
                <Button
                    label="Neuer Nutzer"
                    icon="pi pi-plus"
                    class="mr-2"
                    @click="openNew"
                />
            </template>
        </Toolbar>
        <DataTable
            :value="users"
            :paginator="true"
            :rows="10"
            data-key="id"
            :row-hover="true"
            filter-display="row"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="['username', 'role']"
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
                            placeholder="Search"
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
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Nutzername suchen"
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
        </DataTable>

        <Dialog
            v-model:visible="newUserDialog"
            :style="{ width: '450px' }"
            header="Neuer Nutzer - Details"
            :modal="true"
        >
            <div class="flex flex-col gap-6">
                <div>
                    <label for="username" class="mb-3 block font-bold"
                        >Username</label
                    >
                    <InputText
                        id="username"
                        v-model.trim="newUser.username"
                        required="true"
                        autofocus
                        :invalid="newUserSubmitted && !newUser.username"
                        fluid
                    />
                    <small
                        v-if="newUserSubmitted && !newUser.username"
                        class="text-red-500"
                        >Benutzername ist erforderlich.</small
                    >
                </div>

                <div>
                    <label for="password" class="mb-3 block font-bold"
                        >Passwort</label
                    >
                    <Password
                        id="password"
                        v-model.trim="newUser.password"
                        required
                        :invalid="newUserSubmitted && !newUser.password"
                        fluid
                        toggle-mask
                        :feedback="false"
                    />
                    <small
                        v-if="newUserSubmitted && !newUser.password"
                        class="text-red-500"
                        >Passwort ist erforderlich.</small
                    >
                </div>

                <div>
                    <label for="firstName" class="mb-3 block font-bold"
                        >Vorname</label
                    >
                    <InputText
                        id="firstName"
                        v-model.trim="newUser.firstName"
                        required="true"
                        :invalid="newUserSubmitted && !newUser.firstName"
                        fluid
                    />
                    <small
                        v-if="newUserSubmitted && !newUser.firstName"
                        class="text-red-500"
                        >Vorname ist erforderlich.</small
                    >
                </div>

                <div>
                    <label for="lastName" class="mb-3 block font-bold"
                        >Nachname</label
                    >
                    <InputText
                        id="lastName"
                        v-model.trim="newUser.lastName"
                        required="true"
                        :invalid="newUserSubmitted && !newUser.lastName"
                        fluid
                    />
                    <small
                        v-if="newUserSubmitted && !newUser.lastName"
                        class="text-red-500"
                        >Nachname ist erforderlich.</small
                    >
                </div>

                <div>
                    <label for="role" class="mb-3 block font-bold">Rolle</label>
                    <Select
                        id="role"
                        v-model="newUserRole"
                        :options="roles"
                        optionLabel="label"
                        fluid
                    ></Select>
                </div>
            </div>

            <template #footer>
                <Button
                    label="Abbrechen"
                    icon="pi pi-times"
                    text
                    @click="hideDialog"
                />
                <Button
                    label="Erstellen"
                    icon="pi pi-check"
                    @click="saveNewUser"
                />
            </template>
        </Dialog>
    </div>
</template>
