<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useToast } from 'primevue'
import SemesterService from '@/service/semester.service'
import type { ISemesterResponse } from '@workspace/shared'

const toast = useToast()

const loadingSemester = ref(false)
const semesters = ref<ISemesterResponse[]>([])
const semesterSelect = ref<SelectOption[]>([])
const booleanOptions = ref([
    { label: 'Ja', value: true },
    { label: 'Nein', value: false },
])

onBeforeMount(() => {
    loadingSemester.value = true
    SemesterService.getSemesters().then((res) => {
        if (res.error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Semester',
                detail: res.error,
                life: 5000,
            })
        } else {
            semesters.value = res.data
            semesterSelect.value = res.data.map((s) => ({
                label: s.name,
                value: s.id,
            }))
        }
        loadingSemester.value = false
    })
})

import MentoringTable from './components/MentoringTable.vue'
import SemesterTable from './components/SemesterTable.vue'
import DiscountTable from './components/DiscountTable.vue'
import { SelectOption } from '@/types'

/**
 * Wird ausgeführt, wenn ein neues Semester erstellt wurde.
 */
const handleSemesterCreated = (newSemester: ISemesterResponse) => {
    semesters.value.push(newSemester)
    semesterSelect.value.push({
        label: newSemester.name,
        value: newSemester.id,
    })
}

/**
 * Wird ausgeführt, wenn ein Semester aktualisiert wurde.
 * Hier wird das Semester in der Liste ersetzt und die Select-Optionen aktualisiert.
 */
const handleSemesterUpdated = (updatedSemester: ISemesterResponse) => {
    // Aktualisiere das Semester in der Liste
    const index = semesters.value.findIndex((s) => s.id === updatedSemester.id)
    if (index !== -1) {
        semesters.value[index] = updatedSemester
        // Aktualisiere die Option im semesterSelect
        const optionIndex = semesterSelect.value.findIndex(
            (o) => o.value === updatedSemester.id
        )
        if (optionIndex !== -1) {
            semesterSelect.value[optionIndex] = {
                label: updatedSemester.name,
                value: updatedSemester.id,
            }
        }
    }
}
</script>

<template>
    <div class="card">
        <h1 class="text-xl font-semibold">Stammdatenverwaltung</h1>
    </div>
    <div class="card">
        <MentoringTable :semesterSelect="semesterSelect" />
    </div>
    <div class="grid grid-cols-6 gap-4">
        <div class="card col-span-3 mb-0">
            <SemesterTable
                :semesters="semesters"
                :loading="loadingSemester"
                :booleanOptions="booleanOptions"
                @semester-created="handleSemesterCreated"
                @semester-updated="handleSemesterUpdated"
            />
        </div>
        <div class="card col-span-3">
            <DiscountTable />
        </div>
    </div>
</template>
