<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, reactive, ref } from 'vue'
import UserService from '@/service/user.service'
import { IUserResponse } from '@workspace/shared'
import { DataTableFilterMeta, useToast } from 'primevue'
import { UserRole } from '@workspace/shared'
import { getObjectAsFilter } from '@/helpers/functions'

const users = ref<IUserResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const loading = ref(false)
const toast = useToast()

// Define roles for filtering
const roles = reactive(getObjectAsFilter(UserRole))

// Fetch user data
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
            users.value = [...(data || [])].map((d) => {
                d.createdAt = new Date(d.createdAt)
                d.updatedAt = new Date(d.updatedAt)
                return d
            })
            console.log(users.value)
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
            <Column field="id" header="ID" style="min-width: 6rem">
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
    </div>
</template>
