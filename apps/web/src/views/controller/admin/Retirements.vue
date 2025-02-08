<script setup lang="ts">
// import of required modules, libraries and services
import { onBeforeMount, ref, computed } from 'vue'
import TeacherService from '@/service/teacher.service'
import { ITeacherResponse } from '@workspace/shared'

// reactive variables for saving teachers, filter criteria and UI states
const teachers = ref<ITeacherResponse[]>([])
const loading = ref(false)

// loads initial data from the table for teachers
onBeforeMount(() => {
    loading.value = true

    // loads teachers
    TeacherService.getTeachers().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn('[Retirement-Overview] Couldn`t load teachers')
        } else {
            teachers.value = data.map((teacher: ITeacherResponse) => teacher)
        }
    })

    loading.value = false
})

// Utility to format dates
const formatDate = (value: string | Date) => {
    const date = new Date(value)
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

// Utility to calculate remaining days until retirement
const calculateRemainingDays = (retirementDate: string | Date) => {
    const today = new Date()
    const retirement = new Date(retirementDate)
    const timeDiff = retirement.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff
}

// Utility to convert days to years and months
const convertDaysToYearsMonths = (days: number) => {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    return `${years} Jahre ${months} Monate`
}

// Computed property to sort teachers by remaining days until retirement
const sortedTeachers = computed(() => {
    return teachers.value
        .map((teacher) => ({
            ...teacher,
            remainingDays: calculateRemainingDays(teacher.retirementDate),
        }))
        .sort((a, b) => a.remainingDays - b.remainingDays)
})
</script>

<template>
    <div class="card">
        <div class="mb-4 flex justify-between">
            <h1 class="mb-4 text-xl font-semibold">
                Übersicht der Ruhestandsdaten der Lehrenden
            </h1>
        </div>

        <!-- table to display the data -->
        <DataTable
            :value="sortedTeachers"
            size="small"
            data-key="id"
            showGridlines
            scrollable
            scrollHeight="70vh"
        >
            <!-- Empty Table State -->
            <template #empty>Keine Lehrenden gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Name Column -->
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }"
                    >{{ data.user.firstName }}
                    {{ data.user.lastName }}</template
                >
            </Column>

            <!-- Retirement Date Column -->
            <Column
                field="retirementDate"
                header="Ruhestandsdatum"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{
                    formatDate(data.retirementDate)
                }}</template>
            </Column>

            <!-- Remaining Days Column -->
            <Column
                field="remainingDays"
                header="Verbleibende Tage"
                style="min-width: 8rem; justify-content: space-between"
                sortable
            >
                <template #body="{ data }">
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        "
                    >
                        <div
                            style="
                                display: flex;
                                flex-basis: 50%;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <span>{{ data.remainingDays }}</span>
                            <span
                                ><i
                                    >(ca.
                                    {{
                                        convertDaysToYearsMonths(
                                            data.remainingDays
                                        )
                                    }})</i
                                ></span
                            >
                        </div>
                        <div
                            v-if="data.remainingDays < 180"
                            :style="{
                                color: 'white',
                                fontWeight: 'bold',
                                backgroundColor: 'orange',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 8px',
                            }"
                        >
                            <span>Warnung: Bevorstehender Ruhestand</span>
                            <i
                                class="pi pi-exclamation-triangle"
                                style="margin-left: 8px"
                            ></i>
                        </div>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
