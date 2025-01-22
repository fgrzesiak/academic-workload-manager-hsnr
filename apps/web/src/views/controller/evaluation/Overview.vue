<script setup lang="ts">
import { onBeforeMount, ref, computed, } from 'vue'
import TeachingDutyService from '@/service/teachingDuty.service'
import TeacherService from '@/service/teacher.service'
import SemesterService from '@/service/semester.service'
import SupervisionService from '@/service/supervision.service'
import SupervisionTypeService from '@/service/supervisionType.service'
import DiscountService from '@/service/discount.service'
import TeachingEventService from '@/service/teachingEvent.service'
import { ISemesterResponse, ITeacherResponse, IUpdateTeachingDutyRequest, ITeachingDutyResponse, ISupervisionResponse, ISupervisionTypeResponse, IDiscountResponse, ITeachingEventResponse } from '@workspace/shared'
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
const calculationOverlayVisible = ref(false)
var dialogData = ref<RowData | null>(null)

const totalOrderedDiscounts = ref(0);
const totalOrderedCourses = ref(0);

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

    SupervisionService.getSupervisions().then((res) => {
        const { data, error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Betreuungen',
                detail: error,
                life: 5000,
            });
        } else {
            supervisions.value = data.map((supervision: ISupervisionResponse) => supervision);
        }
    });

    SupervisionTypeService.getSupervisionTypes().then((res) => {
        const { data, error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Betreuungsarten',
                detail: error,
                life: 5000,
            });
        } else {
            supervisionTypes.value = data.map((type: ISupervisionTypeResponse) => type);
        }
    });

    DiscountService.getDiscounts().then((res) => {
        const { data, error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Ermäßigungen',
                detail: error,
                life: 5000,
            });
        } else {
            discounts.value = data.map((discount: IDiscountResponse) => discount);
        }
    });

    TeachingEventService.getTeachingEvents().then((res) => {
        const { data, error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Kurse',
                detail: error,
                life: 5000,
            });
        } else {
            courses.value = data.map((course: ITeachingEventResponse) => course);
        }
    });

    SemesterService.getSemesters().then((res) => {
        const { data, error } = res;
        if (error) {
            console.warn("[Overview] Couldn`t load semester");
        } else {
            const activeSemesterIndex = data.findIndex((semester: ISemesterResponse) => semester.active === true);
            if (activeSemesterIndex === -1) {
                console.warn("[Overview] No active semester");
                return;
            }
            const period = 6;
            const recentSemesters = data.slice((activeSemesterIndex - period), (activeSemesterIndex + 1));
            semesters.value = recentSemesters;

            // Calculate total ordered discounts and courses for all semesters
            totalOrderedDiscounts.value = discounts.value.reduce((acc, discount) => {
                return discount.ordered ? acc + (discount.scope || 0) : acc;
            }, 0);

            totalOrderedCourses.value = courses.value.reduce((acc, course) => {
                return course.ordered ? acc + (course.hours || 0) : acc;
            }, 0);
        }
    });

    loading.value = false;
};

onBeforeMount(loadData);

// helper function to format numbers
const formatNumber = (value: number | null) => {
    return value !== null ? value.toFixed(2) : '-' ;
};

const getTotalOrderedAndSaldo = (teacherName: string) => {
    const totalOrderedDiscounts = parseFloat(tableData.value.teacherTotals.find((t: { teacherName: string }) => t.teacherName === teacherName)?.totalOrderedDiscounts || '0');
    const totalOrderedCourses = parseFloat(tableData.value.teacherTotals.find((t: { teacherName: string }) => t.teacherName === teacherName)?.totalOrderedCourses || '0');
    const totalOrdered = totalOrderedDiscounts + totalOrderedCourses;
    const totalSaldo = parseFloat(getTotal('result', teacherName));
    if (totalSaldo < 0) {
        return `Gesamtsaldo: ${(totalOrdered + totalSaldo).toFixed(2)} <i class="pi pi-flag" style="margin-left: 8px;"></i> <span class="text-sm">(${totalOrdered.toFixed(2)} + ${totalSaldo.toFixed(2)})</span>`;
    } else {
        return `Gesamtsaldo: ${totalSaldo.toFixed(2)}`;
    }
};

const tableData = computed(() => {
    // group data by relevant IDs to avoid repeated filtering
    const groupedDiscounts = discounts.value.reduce((acc, discount) => {
        const key = `${discount.teacherId}-${discount.semesterPeriodId}`;
        if (!acc[key]) acc[key] = { ordered: [], unordered: [] };
        acc[key][discount.ordered ? "ordered" : "unordered"].push(discount);
        return acc;
    }, {} as Record<string, { ordered: IDiscountResponse[]; unordered: IDiscountResponse[] }>);

    const groupedCourses = courses.value.reduce((acc, course) => {
        const key = `${course.teacherId}-${course.semesterPeriodId}`;
        if (!acc[key]) acc[key] = { ordered: [], unordered: [] };
        acc[key][course.ordered ? "ordered" : "unordered"].push(course);
        return acc;
    }, {} as Record<string, { ordered: ITeachingEventResponse[]; unordered: ITeachingEventResponse[] }>);

    const groupedSupervisions = supervisions.value.reduce((acc, supervision) => {
        const key = `${supervision.teacherId}-${supervision.semesterPeriodId}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(supervision);
        return acc;
    }, {} as Record<string, ISupervisionResponse[]>);

    const groupedDeputats = deputats.value.reduce((acc, deputat) => {
        const key = `${deputat.teacherId}-${deputat.semesterPeriodId}`;
        acc[key] = deputat;
        return acc;
    }, {} as Record<string, ITeachingDutyResponse>);

    const teacherTotals = teachers.value.map((teacher) => {
        const totalOrderedDiscounts = discounts.value.reduce((acc, discount) => {
            return discount.teacherId === teacher.id && discount.ordered ? acc + (discount.scope || 0) : acc;
        }, 0);

        const totalOrderedCourses = courses.value.reduce((acc, course) => {
            return course.teacherId === teacher.id && course.ordered ? acc + (course.hours || 0) : acc;
        }, 0);

        return {
            teacherName: `${teacher.lastName}, ${teacher.firstName}`,
            totalOrderedDiscounts: formatNumber(totalOrderedDiscounts),
            totalOrderedCourses: formatNumber(totalOrderedCourses),
        };
    });

    const data = teachers.value.flatMap((teacher) => {
        return semesters.value.map((semester) => {
            const key = `${teacher.id}-${semester.id}`;

            // retrieve data from previously grouped values
            const teacherDiscounts = groupedDiscounts[key] || { ordered: [], unordered: [] };
            const teacherCourses = groupedCourses[key] || { ordered: [], unordered: [] };
            const teacherSupervisions = groupedSupervisions[key] || [];
            const deputat = groupedDeputats[key];
            const individualDeputat = deputat?.individualDuty ?? 0;
            const sumBalance = deputat?.sumBalance ?? 0;

            // calculations
            const sumDiscounts = teacherDiscounts.unordered.reduce((acc, discount) => acc + (discount.scope || 0), 0);
            const sumOrderedDiscounts = teacherDiscounts.ordered.reduce((acc, discount) => acc + (discount.scope || 0), 0);

            const sumCourses = teacherCourses.unordered.reduce((acc, course) => acc + (course.hours || 0), 0);
            const sumOrderedCourses = teacherCourses.ordered.reduce((acc, course) => acc + (course.hours || 0), 0);

            const sumSupervisions = teacherSupervisions.reduce((acc, supervision) => {
                const supervisionType = supervisionTypes.value.find(
                    (type) => type.typeOfSupervisionId === supervision.supervisionTypeId
                );
                const factor = supervisionType?.calculationFactor || 0;
                return acc + factor;
            }, 0);

            //limit of supervisions
            const maxSupervisions = 3.0;

            const supervisionsExpire = sumSupervisions > maxSupervisions ? sumSupervisions - maxSupervisions : 0;
            const adjustedSupervisions = Math.min(sumSupervisions, maxSupervisions);

            const totalHours = sumCourses + sumDiscounts + adjustedSupervisions;
            const result = totalHours - individualDeputat;

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
                sumBalance: formatNumber(sumBalance),
                result: formatNumber(result),
            };
        });
    });

    return { data, teacherTotals };
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
    sumBalance: number;
    result: number;
}

const getTotal = (field: keyof RowData, teacherName: string) => {
    const teacherRows = tableData.value.data.filter(row => row.teacherName === teacherName);
    const rowsWithoutFirst = teacherRows.slice(1);

    const total = rowsWithoutFirst.reduce((sum, row) => {
        const value = Number(row[field]) || 0;  
        return sum + value;
    }, 0);

    return total.toFixed(2);
};

const openCalculationDialog = (data: RowData) => {
    dialogData.value = data;
    calculationOverlayVisible.value = true;
};

const calculateSaldo = (data: RowData | null) => {
    if (data === null) return;

    // Find the correct id from the deputats array
    const deputat = deputats.value.find(deputat => 
        deputat.teacherId === teachers.value.find(teacher => `${teacher.lastName}, ${teacher.firstName}` === data.teacherName)?.id &&
        deputat.semesterPeriodId === semesters.value.find(semester => semester.name === data.semesterName)?.id
    );

    // Build the updateData object
    const updateData: IUpdateTeachingDutyRequest = {
        id: deputat?.id ?? 0,
        teacherId: deputat?.teacherId ?? undefined,
        semesterPeriodId: deputat?.semesterPeriodId ?? undefined,
        individualDuty: deputat?.individualDuty ?? 0,
        sumBalance: parseFloat(data.result.toString()),
    };

    console.log(updateData);

    // Send the updated data to the database
    TeachingDutyService.updateTeachingDuty(updateData).then((res) => {
        const { error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Aktualisieren des Saldos',
                detail: error,
                life: 5000,
            });
        } else {
            toast.add({
                severity: 'success',
                summary: 'Saldo erfolgreich aktualisiert',
                detail: 'Das Saldo wurde erfolgreich in der Datenbank aktualisiert.',
                life: 5000,
            });

            // Reload the data from the database
            loadData();
        }
    });

    calculationOverlayVisible.value = false;
};

</script>
<template>
     <div class="card">
        <div class="flex justify-between mb-4">
            <h1 class="mb-4 text-xl font-semibold">Saldierungen</h1>
        </div>

        <DataTable 
            :value="tableData.data"
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
                        <div v-if="data.result !== data.sumBalance" class="flex-row items-center">
                            <span :style="{ color: (data.result - data.sumBalance) < 0 ? 'red' : 'green' }">
                                &nbsp;({{ (data.result - data.sumBalance) > 0 ? '+' : '' }}{{ (data.result - data.sumBalance).toFixed(2) }})
                            </span>
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Calculation -->
            <Column
            style="width: 4rem; text-align: center"
            :headerStyle="{ textAlign: 'center' }"
            >
                <template #body="{ data }">
                    <Button
                        v-if="data.result !== data.sumBalance"
                        icon="pi pi-calculator"
                        class="p-button-success"
                        @click="openCalculationDialog(data)"
                        outlined
                    />
                </template>
            </Column>

            <!-- Dialog Saldierung -->
            <Dialog
                v-model:visible="calculationOverlayVisible"
                header="Saldo berechnen"
                :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '40vw' }"
                :modal="true"
            >
                <!-- Header mit Name und Semester -->
                <div class="dialog-header">
                <h3 class="text-lg font-bold mb-4">
                    Lehrperson: {{ dialogData?.teacherName }}
                </h3>
                <p class="text-md mb-6">
                    Semester: {{ dialogData?.semesterName }}
                </p>
                </div>

                <!-- Mathematische Darstellung der Berechnung -->
                <div class="calculation-details">
                <p class="text-md">
                    Summe der Kurse: <strong>{{ dialogData?.sumCourses }}</strong>
                </p>
                <p class="text-md">
                    Summe der Ermäßigungen: <strong>{{ dialogData?.sumDiscounts }}</strong>
                </p>
                <p class="text-md">
                    Berücksichtigte Betreuungen (max. 3,0): <strong>{{ dialogData?.sumSupervisions }}</strong>
                </p>
                <p class="text-md">
                    Zuerreichendes Deputat : <strong>{{ dialogData?.individualDeputat }}</strong>
                </p>
                <p class="text-md mt-4">
                    <strong>Berechnung:</strong>
                </p>
                <p class="text-lg font-mono">
                    ({{ dialogData?.sumCourses }} + {{ dialogData?.sumDiscounts }} + {{ dialogData?.sumSupervisions }}) 
                    - {{ dialogData?.individualDeputat }}
                </p>
                <p class="text-lg font-bold mt-4">
                    Saldo Semester: <span :style="{ color: (dialogData?.result ?? 0) < 0 ? 'red' : 'green' }">
                    {{ dialogData?.result }}
                    </span>
                </p>
                <p v-if="dialogData?.result !== dialogData?.sumBalance" class="text-lg font-bold mt-4">
                    Abweichung von bereits berechnetem Saldo: <span :style="{ color: ((dialogData?.result?? 0) - ( dialogData?.sumBalance ?? 0)) < 0 ? 'red' : 'green' }">
                    {{ ((dialogData?.result ?? 0) - (dialogData?.sumBalance ?? 0)) > 0 ? '+' : '' }}{{ ((dialogData?.result ?? 0) - (dialogData?.sumBalance ?? 0)).toFixed(2) }}
                    </span>
                </p>
                </div>

                <!-- Footer mit Aktionen -->
                <template #footer>
                    <Button
                    type="submit"
                    label="Korrekt"
                    class="p-button-success"
                    icon="pi pi-send"
                    @click="calculateSaldo(dialogData)"
                    />
                </template>
            </Dialog>
            <template #groupfooter="{ data }">
                <div class="flex justify-between w-full">
                    <span class="font-bold">
                        Gesamtsumme Angeordnet: 
                        {{
                            (
                                parseFloat(tableData.teacherTotals.find(t => t.teacherName === data.teacherName)?.totalOrderedDiscounts || '0') +
                                parseFloat(tableData.teacherTotals.find(t => t.teacherName === data.teacherName)?.totalOrderedCourses || '0')
                            ).toFixed(2)
                        }}
                    </span>
                    <span class="font-bold" v-html="getTotalOrderedAndSaldo(data.teacherName)"></span>
                </div>
            </template>
        </DataTable>
    </div>
</template>
