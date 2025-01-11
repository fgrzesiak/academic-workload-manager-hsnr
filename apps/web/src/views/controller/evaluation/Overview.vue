<script setup lang="ts">
import { onBeforeMount, ref, computed, } from 'vue'
import TeachingDutyService from '@/service/teachingDuty.service'
import TeacherService from '@/service/teacher.service'
import SemesterService from '@/service/semester.service'
import SupervisionService from '@/service/supervision.service'
import SupervisionTypeService from '@/service/supervisionType.service'
import DiscountService from '@/service/discount.service'
import TeachingEventService from '@/service/teachingEvent.service'
import { ISemesterResponse, ITeacherResponse, ITeachingDutyResponse, ISupervisionResponse, ISupervisionTypeResponse, IDiscountResponse, ITeachingEventResponse } from '@workspace/shared'
import { useToast } from 'primevue/usetoast'

const teachers = ref<ITeacherResponse[]>([])
const semesters = ref<ISemesterResponse[]>([])
const deputats = ref<ITeachingDutyResponse[]>([])
const supervisions = ref<ISupervisionResponse[]>([])
const supervisionTypes = ref<ISupervisionTypeResponse[]>([])
const discounts = ref<IDiscountResponse[]>([])
const courses = ref<ITeachingEventResponse[]>([])
const loading = ref(false)
const toast = useToast()
const expandedRowGroups = ref<string[]>([])

onBeforeMount(() => {
    loading.value = true
    TeachingDutyService.getTeachingDuties().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Deputate',
                detail: error,
                life: 5000,
            })
        } else {
            deputats.value = data.map((deputat: ITeachingDutyResponse) => { 
                return deputat 
            })
        }
    })

    SemesterService.getSemesters().then((res) => {
        const { data, error } = res;
        if (error) {
            console.warn("[Overview] Couldn`t load semester");
        } else {
            // Finde das neueste aktive Semester
            const activeSemesterIndex = data.findIndex((semester: ISemesterResponse) => semester.active === true);

            if (activeSemesterIndex === -1) {
                console.warn("[Overview] No active semester");
                return;
            }

            // Anzahl der Semester die berücksichtigt werden sollen
            const period = 6;
            // Extrahiere die letzten x(period) Semester ab dem aktiven Semester
            const recentSemesters = data.slice((activeSemesterIndex - period), (activeSemesterIndex + 1));
            semesters.value = recentSemesters;
        }
    })

    TeacherService.getTeachers().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Lehrer',
                detail: error,
                life: 5000,
            })
        }  else {
            teachers.value = data.map((teacher: ITeacherResponse) => { 
                return teacher 
            })
        }
    })

    SupervisionService.getSupervisions().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Betreuungen',
                detail: error,
                life: 5000,
            })
        }  else {
            supervisions.value = data.map((supervision: ISupervisionResponse) => { 
                return supervision 
            })
        }
    })

    SupervisionTypeService.getSupervisionTypes().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Betreuungsarten',
                detail: error,
                life: 5000,
            })
        } else {
            supervisionTypes.value = data.map((type: ISupervisionTypeResponse) => { 
                return type 
            })
        }
    })

    DiscountService.getDiscounts().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Ermäßigungen',
                detail: error,
                life: 5000,
            })
        } else {
            discounts.value = data.map((discount: IDiscountResponse) => { 
                return discount 
            })
        }
    })

    TeachingEventService.getTeachingEvents().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Kurse',
                detail: error,
                life: 5000,
            })
        } else {
            courses.value = data.map((course: ITeachingEventResponse) => { 
                return course 
            })
        }
    })

    loading.value = false
});

// Helper-Funktionen für Formatierung
const formatNumber = (value: number | null) => {
    return value !== null ? value.toFixed(2) : '-' ;
};

const tableData = computed(() => {
    // Erstelle eine flache Liste von Datenzeilen
    return teachers.value.flatMap((teacher) => {
        return semesters.value.map((semester) => {
            // Filtere die relevanten Daten für den Lehrer und das Semester
            const teacherDiscounts = discounts.value.filter(
                (discount) =>
                    discount.teacherId === teacher.id &&
                    discount.semesterPeriodId === semester.id
            );

            const teacherCourses = courses.value.filter(
                (course) =>
                    course.teacherId === teacher.id &&
                    course.semesterPeriodId === semester.id
            );

            const teacherSupervisions = supervisions.value.filter(
                (supervision) =>
                    supervision.teacherId === teacher.id &&
                    supervision.semesterPeriodId === semester.id
            );

            // Berechnung der Summe der Betreuungen mit Berücksichtigung des calculationFactor
            const sumSupervisions = teacherSupervisions.reduce((acc, supervision) => {
                const supervisionType = supervisionTypes.value.find(
                    (type) => type.typeOfSupervisionId === supervision.supervisionTypeId
                );
                const factor = supervisionType?.calculationFactor || 0;
                return acc + factor;
            }, 0);

            // Berechnungen für Kurse und Ermäßigungen
            const sumCourses = teacherCourses.reduce((acc, course) => acc + (course.hours || 0), 0);
            const sumDiscounts = teacherDiscounts.reduce((acc, discount) => acc + (discount.scope || 0), 0);

            const individualDeputat = deputats.value.find(
                (deputat) =>
                    deputat.teacherId === teacher.id &&
                    deputat.semesterPeriodId === semester.id
            )?.individualDuty ?? 0;

            // const sumIndividualDeputat = individualQuota.reduce((acc, deputat) => acc + (deputat.individualDuty || 0), 0);

            // Ergebnis der Stunden
            const totalHours = sumCourses + sumDiscounts + sumSupervisions;
            const result = totalHours - individualDeputat;

            // Erstelle ein einzelnes Zeilenobjekt
            return {
                teacherName: `${teacher.lastName}, ${teacher.firstName}`,
                semesterName: semester.name,
                sumCourses: formatNumber(sumCourses),
                sumDiscounts: formatNumber(sumDiscounts),
                sumSupervisions: formatNumber(sumSupervisions),
                individualDeputat: formatNumber(individualDeputat),
                result: formatNumber(result),
            };
        });
    });
});

interface RowData {
    teacherName: string;
    semesterName: string;
    sumCourses: number;
    sumDiscounts: number;
    sumSupervisions: number;
    individualDeputat: number;
    result: number;
}

const getTotal = (field: keyof RowData, teacherName: string) => {
    const teacherRows = tableData.value.filter(row => row.teacherName === teacherName);
    const rowsWithoutFirst = teacherRows.slice(1);

    const total = rowsWithoutFirst.reduce((sum, row) => {
        const value = Number(row[field]) || 0;  
        return sum + value;
    }, 0);

    return total.toFixed(2);
};

</script>
<template>
     <div class="card">
        <div class="flex justify-between mb-4">
            <h1 class="mb-4 text-xl font-semibold">Saldierungen</h1>
        </div>

        <DataTable 
            :value="tableData"
            size="small"
            showGridlines
            scrollable
            scrollHeight="70vh"
            v-model:expandedRowGroups="expandedRowGroups"
            expandableRowGroups
            rowGroupMode="subheader" 
            groupRowsBy="teacherName"
        >
            <!-- Empty Table State -->
            <template #empty>Keine Daten gefunden.</template>

            <!-- Gruppenkopf für Lehrer -->
            <template #groupheader="{ data }">
                <span class="align-middle ml-2 font-bold leading-normal">{{ data.teacherName }}</span>
            </template>

            <!-- Name des Semesters -->
            <Column field="semesterName" header="Semestername" :style="{ minWidth: '150px' }" />

            <!-- Summe der Kurse -->
            <Column 
                field="sumCourses" 
                header="Summe der Kurse" 
                :style="{ minWidth: '150px', textAlign: 'center' }" 
            />

            <!-- Summe der Ermäßigungen -->
            <Column 
                field="sumDiscounts" 
                header="Summe der Ermäßigungen" 
                :style="{ minWidth: '150px', textAlign: 'center' }" 
            />

            <!-- Summe der Betreuungen -->
            <Column 
                field="sumSupervisions" 
                header="Summe der Betreuungen" 
                :style="{ minWidth: '150px', textAlign: 'center' }" 
            />

            <!-- Individuelles Deputat -->
            <Column 
                field="individualDeputat" 
                header="Individuelles Deputat" 
                :style="{ minWidth: '150px', textAlign: 'center' }" 
            />

            <!-- Saldo Semester -->
            <Column 
                field="result" 
                header="Saldo Semester" 
                :style="{ minWidth: '150px', textAlign: 'center' }"
            />

            <template #groupfooter="{ data }">
                <div class="flex justify-end w-full">Gesamtsaldo (letzte 6 Semester):&nbsp; <span class="font-bold">{{ getTotal('result', data.teacherName) }}</span></div>
            </template>
        </DataTable>
    </div>
</template>
