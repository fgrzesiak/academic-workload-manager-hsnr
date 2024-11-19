<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { onBeforeMount, reactive, ref } from 'vue'
import UserService from '@/service/user.service'
import { IUserResponse } from '@workspace/shared'
import { useToast } from 'primevue'

const users = ref<IUserResponse[]>([])
const filters = ref<any>(null)
const loading = ref(false)
const toast = useToast()

// Define roles for filtering
const roles = reactive([
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Controller', value: 'controller' },
])

// Fetch user data
onBeforeMount(() => {
    loading.value = true
    UserService.getUsers().then((res) => {
        loading.value = false
        const { data, error } = res
        if (error.value) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error.value,
                life: 5000,
            })
        } else if (!data.value) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: 'Ein unbekannter Fehler ist aufgetreten.',
                life: 5000,
            })
        } else {
            users.value = data.value
        }
    })
    initFilters()
})

// Initialize filters
function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: {
            operator: FilterOperator.AND,
            constraints: [
                { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            ],
        },
        role: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        createdAt: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        updatedAt: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
    }
}

// Utility to format dates
function formatDate(value: Date) {
    return new Date(value).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}
</script>

<template>
    <div class="card">
        <div class="mb-4 text-xl font-semibold">Nutzerverwaltung</div>
        <DataTable
            :value="users"
            :paginator="true"
            :rows="10"
            data-key="id"
            :row-hover="true"
            filter-display="menu"
            :loading="loading"
            :filters="filters"
            :global-filter-fields="['username', 'role']"
            show-gridlines
        >
            <!-- Table Header -->
            <template #header>
                <div class="flex justify-between">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Clear Filters"
                        outlined
                        @click="initFilters"
                    />
                    <div class="flex items-center gap-2">
                        <i class="pi pi-search" />
                        <InputText
                            v-model="filters['global'].value"
                            placeholder="Search"
                        />
                    </div>
                </div>
            </template>

            <!-- Empty Table State -->
            <template #empty>No users found.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 6rem">
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Username Column -->
            <Column field="username" header="Username" style="min-width: 12rem">
                <template #body="{ data }">{{ data.username }}</template>
                <template #filter="{ filterModel }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Search by username"
                    />
                </template>
            </Column>

            <!-- Role Column -->
            <Column
                field="role"
                header="Role"
                style="min-width: 10rem"
                filter-field="role"
            >
                <template #body="{ data }">{{ data.role }}</template>
                <template #filter="{ filterModel }">
                    <Select
                        v-model="filterModel.value"
                        :options="roles"
                        option-label="label"
                        option-value="value"
                        placeholder="Select Role"
                        show-clear
                    />
                </template>
            </Column>

            <!-- Created At Column -->
            <Column
                field="createdAt"
                header="Created At"
                data-type="date"
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{
                    formatDate(data.createdAt)
                }}</template>
                <template #filter="{ filterModel }">
                    <DatePicker
                        v-model="filterModel.value"
                        date-format="mm/dd/yy"
                        placeholder="Select a date"
                    />
                </template>
            </Column>

            <!-- Updated At Column -->
            <Column
                field="updatedAt"
                header="Updated At"
                data-type="date"
                style="min-width: 12rem"
            >
                <template #body="{ data }">{{
                    formatDate(data.updatedAt)
                }}</template>
                <template #filter="{ filterModel }">
                    <DatePicker
                        v-model="filterModel.value"
                        date-format="mm/dd/yy"
                        placeholder="Select a date"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
