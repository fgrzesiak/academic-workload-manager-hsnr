<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import TeachingDutyService from '@/service/teachingDuty.service'
import TeacherService from '@/service/teacher.service'
import SemesterService from '@/service/semester.service'
import EvaluationSettingsService from '@/service/evaluationSettings.service'
import {
    ISemesterResponse,
    ITeacherResponse,
    ITeachingDutyResponse,
} from '@workspace/shared'
import { useToast } from 'primevue/usetoast'

const teachers = ref<ITeacherResponse[]>([])
const semesters = ref<ISemesterResponse[]>([])
const deputats = ref<ITeachingDutyResponse[]>([])
const loading = ref(false)
const toast = useToast()

onBeforeMount(() => {
    loading.value = true
    TeachingDutyService.getTeachingDuties().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            deputats.value = data.map((deputat: ITeachingDutyResponse) => {
                return deputat
            })
        }
    })

    Promise.all([
        SemesterService.getSemesters(),
        EvaluationSettingsService.getEvaluationSettings(),
    ]).then(([semesterRes, settingsRes]) => {
        const { data: semesterData, error: semesterError } = semesterRes
        const { data: settingsData, error: settingsError } = settingsRes

        if (semesterError) {
            console.warn("[Export] Couldn't load semester")
            return
        }

        if (settingsError) {
            console.warn(
                "[Export] Couldn't load settings, using default period of 6"
            )
        }

        // default value for the period
        let period = 6

        // if settings were loaded successfully, extract value
        if (settingsData) {
            const periodSetting = settingsData.find(
                (s: { key: string }) => s.key === 'saldation_period'
            )
            period = periodSetting ? parseInt(periodSetting.value, 10) || 6 : 6
        }

        // find the latest active semester
        const activeSemesterIndex = semesterData.findIndex(
            (semester: ISemesterResponse) => semester.active === true
        )

        if (activeSemesterIndex === -1) {
            console.warn('[Export] No active semester')
            return
        }

        // extract the last `period` semesters from the active semester
        const recentSemesters = semesterData.slice(
            activeSemesterIndex - (period - 1),
            activeSemesterIndex + 1
        )
        semesters.value = recentSemesters
    })

    TeacherService.getTeachers().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn('[Export] Couldn`t load teachers')
        } else {
            teachers.value = data.map((teacher: ITeacherResponse) => {
                return teacher
            })
        }
    })
})

type RowData = {
    [key: number]: number | null // Werte für jedes Semester
    name: string // Name des Lehrers
}

const tableData = computed(() => {
    return teachers.value.map((teacher) => {
        const rowData: RowData = {
            name: `${teacher.lastName}`,
        }

        // Für jedes Semester die sumBalance hinzufügen
        semesters.value.forEach((semester) => {
            const duty = deputats.value.find(
                (d) =>
                    d.teacherId === teacher.id &&
                    d.semesterPeriodId === semester.id
            )
            rowData[semester.id] = duty ? duty.sumBalance : null
        })
        loading.value = false
        return rowData
    })
})

// Helper-Funktionen für Formatierung
const formatSumBalance = (value: number | null) => {
    return value !== null ? value.toFixed(2) : '-'
}

const getSemesterName = (id: number) => {
    const semester = semesters.value.find((s) => s.id === id)
    return semester ? semester.name : 'Unbekannt'
}

const exportCSV = () => {
    // Header erstellen (Name + Semester-Namen)
    const headers = [
        'Name',
        ...semesters.value.map((semester) => getSemesterName(semester.id)),
    ]

    // Zeilen erstellen (Name + Werte für jedes Semester)
    const rows = tableData.value.map((row) => {
        return [
            row.name,
            ...semesters.value.map((semester) => row[semester.id] || 0),
        ]
    })

    // CSV-Daten zusammenfügen
    const csvContent = [
        headers.join(','), // Header
        ...rows.map((row) => row.join(',')),
    ].join('\n')

    // Blob erzeugen
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    // Link erstellen und Datei herunterladen
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'exportSalden.csv'
    link.click()
}
</script>
<template>
    <div class="card">
        <div class="mb-4 flex justify-between">
            <h1 class="mb-4 text-xl font-semibold">
                Export der Semester-Salden
            </h1>
            <Button
                label="Export"
                icon="pi pi-file-export"
                @click="exportCSV()"
            />
        </div>

        <DataTable
            :value="tableData"
            :responsiveLayout="'scroll'"
            showGridlines
            size="small"
        >
            <!-- Empty Table State -->
            <template #empty>Keine Daten gefunden.</template>

            <!-- Spalten mit benutzerdefiniertem Slot -->
            <Column
                field="name"
                header="Lehrperson"
                :style="{ width: '200px' }"
            />

            <!-- Dynamische Semester-Spalten mit benutzerdefiniertem Slot -->
            <template v-for="semester in semesters" :key="semester.id">
                <Column
                    :header="semester.name"
                    :field="getSemesterName(semester.id)"
                    :style="{ textAlign: 'center' }"
                >
                    <template v-slot:body="{ data }">
                        {{ formatSumBalance(data[semester.id]) ?? '-' }}
                    </template>
                </Column>
            </template>
        </DataTable>
    </div>
</template>
