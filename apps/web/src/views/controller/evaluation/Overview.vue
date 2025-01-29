<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import TeachingDutyService from '@/service/teachingDuty.service'
import TeacherService from '@/service/teacher.service'
import SemesterService from '@/service/semester.service'
import EvaluationSettingsService from '@/service/evaluationSettings.service'
import { ISemesterResponse, ITeacherResponse, ITeachingDutyResponse } from '@workspace/shared'
import { useToast } from 'primevue/usetoast'

// define reactive variables
const teachers = ref<ITeacherResponse[]>([])
const semesters = ref<ISemesterResponse[]>([])
const deputats = ref<ITeachingDutyResponse[]>([])
const loading = ref(false)
const toast = useToast()

// function to load data from various services
const loadData = () => {
    loading.value = true;
    TeachingDutyService.getTeachingDuties().then((res) => {
        const { data, error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Deputate',
                detail: error,
                life: 5000,
            });
        } else {
            deputats.value = data.map((deputat: ITeachingDutyResponse) => deputat);
        }
    });

    TeacherService.getTeachers().then((res) => {
        const { data, error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Lehrer',
                detail: error,
                life: 5000,
            });
        } else {
            teachers.value = data.map((teacher: ITeacherResponse) => teacher);
        }
    });

    Promise.all([
        SemesterService.getSemesters(),
        EvaluationSettingsService.getEvaluationSettings()
    ]).then(([semesterRes, settingsRes]) => {
        const { data: semesterData, error: semesterError } = semesterRes;
        const { data: settingsData, error: settingsError } = settingsRes;

        if (semesterError) {
            console.warn("[Export] Couldn't load semester");
            return;
        }

        if (settingsError) {
            console.warn("[Export] Couldn't load settings, using default period of 6");
        }

        // Standardwert für den Zeitraum
        let period = 6;

        // Falls Einstellungen erfolgreich geladen wurden, Wert extrahieren
        if (settingsData) {
            const periodSetting = settingsData.find((s: { key: string }) => s.key === "saldation_period");
            period = periodSetting ? parseInt(periodSetting.value, 10) || 6 : 6;
        }

        // Finde das neueste aktive Semester
        const activeSemesterIndex = semesterData.findIndex((semester: ISemesterResponse) => semester.active === true);

        if (activeSemesterIndex === -1) {
            console.warn("[Export] No active semester");
            return;
        }

        // Extrahiere die letzten `period` Semester ab dem aktiven Semester
        const recentSemesters = semesterData.slice((activeSemesterIndex - (period - 1)), (activeSemesterIndex + 1));
        semesters.value = recentSemesters;
    });

    loading.value = false;
};

// load data before mounting the component
onBeforeMount(loadData);

// computed property to prepare table data
const tableData = computed(() => {
    return teachers.value.map(teacher => {
        const row: { teacherName: string; [key: string]: string } = { teacherName: `${teacher.firstName} ${teacher.lastName}` };
        semesters.value.forEach(semester => {
            const hasSubmitted = deputats.value.some(deputat => deputat.teacherId === teacher.id && deputat.semesterPeriodId === semester.id);
            row[semester.name] = hasSubmitted ? '✅' : '❌';
        });
        return row;
    });
});
</script>

<template>
    <div class="card">
        <h1 class="text-xl font-semibold mb-4">Übersicht der bereits übermittelten Deputate </h1>
        <DataTable :value="tableData" :paginator="true" :rows="10" :loading="loading" responsiveLayout="scroll" size="small" showGridlines>
            <Column field="teacherName" header="Lehrperson" :style="{ minWidth: '200px' }"></Column>
            <Column v-for="semester in semesters" :key="semester.id" :field="semester.name" :header="semester.name" :style="{ minWidth: '150px' }"></Column>
        </DataTable>
    </div>
</template>
