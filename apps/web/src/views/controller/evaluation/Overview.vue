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
            // Filtern und Berechnen der Ermäßigungen
            const teacherDiscountsUnordered = discounts.value.filter(
                (discount) =>
                    discount.teacherId === teacher.id &&
                    discount.semesterPeriodId === semester.id &&
                    discount.ordered === false
            );

            const teacherDiscountsOrdered = discounts.value.filter(
                (discount) =>
                    discount.teacherId === teacher.id &&
                    discount.semesterPeriodId === semester.id &&
                    discount.ordered === true
            );

            // Summe der Ermäßigungen
            const sumDiscounts = teacherDiscountsUnordered.reduce((acc, discount) => acc + (discount.scope || 0), 0);
            const sumOrderedDiscounts = teacherDiscountsOrdered.reduce((acc, discount) => acc + (discount.scope || 0), 0);

            // Filtern und Berechnen der Kurse
            const teacherCoursesUnordered = courses.value.filter(
                (course) =>
                    course.teacherId === teacher.id &&
                    course.semesterPeriodId === semester.id &&
                    course.ordered === false
            );

            const teacherCoursesOrdered = courses.value.filter(
                (course) =>
                    course.teacherId === teacher.id &&
                    course.semesterPeriodId === semester.id &&
                    course.ordered === true
            );

            // Summe der Kurse
            const sumCourses = teacherCoursesUnordered.reduce((acc, course) => acc + (course.hours || 0), 0);
            const sumOrderedCourses = teacherCoursesOrdered.reduce((acc, course) => acc + (course.hours || 0), 0);

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

            // Begrenzung der Summe der Betreuungen auf 3,0 und Speicherung der Differenz
            const maxSupervisions = 3.0;
            const supervisionsExpire = sumSupervisions > maxSupervisions ? sumSupervisions - maxSupervisions : 0;
            const adjustedSupervisions = Math.min(sumSupervisions, maxSupervisions);

            const individualDeputat = deputats.value.find(
                (deputat) =>
                    deputat.teacherId === teacher.id &&
                    deputat.semesterPeriodId === semester.id
            )?.individualDuty ?? 0;

            // Ergebnis der Stunden
            const totalHours = sumCourses + sumDiscounts + adjustedSupervisions; // Verwende die begrenzten Betreuungen
            const result = totalHours - individualDeputat;

            // Erstelle ein einzelnes Zeilenobjekt
            return {
                teacherName: `${teacher.lastName}, ${teacher.firstName}`,
                semesterName: semester.name,
                sumCourses: formatNumber(sumCourses),
                sumOrderedCourses: formatNumber(sumOrderedCourses),
                sumDiscounts: formatNumber(sumDiscounts),
                sumOrderedDiscounts: formatNumber(sumOrderedDiscounts),
                sumSupervisions: formatNumber(sumSupervisions),
                supervisionsExpire: formatNumber(supervisionsExpire),
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
    sumOrderedCourses: number;
    sumDiscounts: number;
    sumOrderedDiscounts: number;
    sumSupervisions: number;
    supervisionsExpire: number;
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
            <Column field="semesterName" header="Semester" :style="{ minWidth: '150px' }" />

            <!-- Summe der Kurse -->
            <Column 
                field="sumCourses" 
                header="Summe der Kurse / Angeordnet" 
                :style="{ minWidth: '150px' }" 
                >
                <template #body="{ data }">
                    <div 
                        :style="{
                            display: 'flex',
                            alignItems: 'center',
                        }"
                    >
                        <span>{{ data.sumCourses }}</span>
                        <div v-if="data.sumOrderedCourses > 0" class="flex-row items-center font-bold">
                            <span>&nbsp;/ {{ data.sumOrderedCourses }}</span>
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Summe der Ermäßigungen -->
            <Column 
                field="sumDiscounts" 
                header="Summe der Ermäßigungen / Angeordnet" 
                :style="{ minWidth: '150px' }" 
            >
                <template #body="{ data }">
                    <div 
                        :style="{
                            display: 'flex',
                            alignItems: 'center',
                        }"
                    >
                        <span>{{ data.sumDiscounts }}</span>
                        <div v-if="data.sumOrderedDiscounts > 0" class="flex-row items-center font-bold">
                            <span>&nbsp;/ {{ data.sumOrderedDiscounts }}</span>
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Summe der Betreuungen -->
            <Column 
                field="sumSupervisions" 
                header="Summe der Betreuungen" 
                :style="{ minWidth: '150px' }" 
            >
                <template #body="{ data }">
                    <div 
                        :style="{
                            backgroundColor: data.sumSupervisions > 3.0 ? 'red' : 'transparent',
                            color: data.sumSupervisions > 3.0 ? 'white' : 'inherit',
                            fontWeight: data.sumSupervisions > 3.0 ? 'bold' : 'normal',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 8px'
                        }"
                    >
                        <span>{{ data.sumSupervisions }}</span>
                        <div v-if="data.sumSupervisions > 3.0" class="flex-row items-center">
                            <span>Verfall: {{ data.supervisionsExpire }}</span>
                            <i class="pi pi-exclamation-triangle" style="margin-left: 8px;"></i>
                        </div>
                        
                    </div>
                </template>
            </Column>

            <!-- Individuelles Deputat -->
            <Column 
                field="individualDeputat" 
                header="Individuelles Deputat" 
                :style="{ minWidth: '150px' }" 
            />

            <!-- Saldo Semester -->
            <Column 
                field="result" 
                header="Saldo Semester" 
                :style="{ minWidth: '150px' }"
            >
                <template #body="{ data }">
                    <div 
                        :style="{
                            color: data.result < 0 ? 'red' : 'green',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }"
                    >
                        <span>{{ data.result }}</span>
                    </div>
                </template>
            </Column>
            <template #groupfooter="{ data }">
                <div class="flex justify-end w-full"><span class="font-bold">Gesamtsaldo: {{ getTotal('result', data.teacherName) }}</span></div>
            </template>
        </DataTable>
    </div>
</template>
