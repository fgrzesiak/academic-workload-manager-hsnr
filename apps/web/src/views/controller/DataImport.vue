<script setup lang="ts">
/**
 * @file DataImport.vue
 * @description Diese Komponente dient als zentrale Ansicht für die Deputatsmeldung.
 *              Hier können Lehrpersonen, Semester und individuelle Deputate ausgewählt werden.
 *              Außerdem werden Lehrveranstaltungen, Betreuungen und Ermäßigungen eingegeben.
 *              Die einzelnen Formabschnitte sind in Child-Komponenten ausgelagert, um Wiederverwendung
 *              und Übersichtlichkeit zu gewährleisten.
 */

import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

// Services aus dem Service-Layer
import SupervisionTypeService from '@/service/supervisionType.service'
import SemesterService from '@/service/semester.service'
import TeacherService from '@/service/teacher.service'
import DiscountTypeService from '@/service/discountType.service'
import TeachingEventService from '@/service/teachingEvent.service'
import SupervisionService from '@/service/supervision.service'
import DiscountService from '@/service/discount.service'
import TeachingDutyService from '@/service/teachingDuty.service'
import CommentService from '@/service/comment.service'
import EvaluationSettingsService from '@/service/evaluationSettings.service'

// Import der Child-Komponenten für die einzelnen Formabschnitte
import CoursesSection from './components/CoursesSection.vue'
import MentoringSection from './components/MentoringSection.vue'
import DiscountsSection from './components/DiscountsSection.vue'

// PrimeVue-Komponenten für den Kopfbereich (Auswahlfelder, Dialog)
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

// Typen aus dem Shared-Package
import type {
    ICreateTeachingEventRequest,
    ICreateSupervisionRequest,
    ICreateDiscountRequest,
    ICreateTeachingDutyRequest,
    ICreateCommentRequest,
} from '@workspace/shared'
import { SelectOption } from '@/types'
import { handleServiceCall } from '@/composables/useServiceHandler'

/**
 * Interface für Options, die zusätzlich einen Berechnungswert enthalten.
 */
interface SelectOptionCalculation extends SelectOption {
    calculation: number
}

// --------------------------
// Reaktive Zustände
// --------------------------
const individualDeputat = ref(18)
const semester = ref(0)
const teacher = ref(0)

// Die Arrays für die einzelnen Eingabebereiche (Lehrveranstaltungen, Betreuungen, Ermäßigungen)
const courses = ref([
    {
        name: '',
        sws: 0,
        ordered: false,
        comment: '',
        showComment: false,
    },
])
const mentoring = ref([
    {
        type: 0,
        matriculationNumber: 0,
        comment: '',
        showComment: false,
        supervisionShare: 0,
    },
])
const reductions = ref([
    {
        type: 0,
        details: '',
        approvedBy: '',
        approvedOn: new Date(),
        sws: 0,
        comment: '',
        showComment: false,
        ordered: false,
    },
])

// Sichtbarkeit des Bestätigungsdialogs
const display = ref(false)

// Optionslisten für Select-Felder
const mentoringTypes = ref<SelectOptionCalculation[]>([])
const reductionTypes = ref<SelectOption[]>([])
const semesterSelect = ref<SelectOption[]>([])
const teacherSelect = ref<SelectOption[]>([])

// Maximale anrechenbare SWS für Betreuungen
const maxSupervisions = ref(3.0)

// Toast-Instanz (für Benachrichtigungen)
const toast = useToast()

// --------------------------
// Computed Properties (Berechnungen)
// --------------------------

// Summe der SWS aus den Lehrveranstaltungen
const coursesSum = computed(() =>
    courses.value.reduce((sum, course) => sum + (course.sws || 0), 0)
)

// Summe der Betreuungs-SWS (basierend auf dem Berechnungsfaktor aus den Options)
const mentoringSum = computed(() => {
    if (!mentoringTypes.value || mentoring.value.length === 0) return 0
    const sum = mentoring.value.reduce((total, mentor) => {
        const selectedType = mentoringTypes.value.find(
            (type) => type.value === mentor.type
        )
        return total + (selectedType?.calculation || 0)
    }, 0)
    return Math.ceil(sum * 1000) / 1000
})

// Summe der SWS aus den Ermäßigungen
const reductionsSum = computed(() =>
    reductions.value.reduce((sum, reduction) => sum + (reduction.sws || 0), 0)
)

// Gesamtbilanz (Summe aus Lehrveranstaltungen, Betreuungen und Ermäßigungen)
const totalBalance = computed(
    () => coursesSum.value + mentoringSum.value + reductionsSum.value
)

// Differenz zum individuellen Lehrdeputat
const balanceDifference = computed(
    () => totalBalance.value - individualDeputat.value
)

// --------------------------
// Funktionen
// --------------------------

/**
 * Öffnet den Bestätigungsdialog.
 */
function openDialog() {
    display.value = true
}

/**
 * Setzt alle Formularfelder auf die Ausgangswerte zurück.
 */
function resetForm() {
    individualDeputat.value = 18
    teacher.value = 0
    semester.value = 0
    courses.value = [
        {
            name: '',
            sws: 0,
            ordered: false,
            comment: '',
            showComment: false,
        },
    ]
    mentoring.value = [
        {
            type: 0,
            matriculationNumber: 0,
            comment: '',
            showComment: false,
            supervisionShare: 0,
        },
    ]
    reductions.value = [
        {
            type: 0,
            details: '',
            approvedBy: '',
            approvedOn: new Date(),
            sws: 0,
            comment: '',
            showComment: false,
            ordered: false,
        },
    ]
}

/**
 * Prüft, ob bereits eine Deputatsmeldung (Lehrtätigkeit) für das gegebene Semester und die Lehrperson existiert.
 *
 * @param semesterId - ID des Semesters
 * @param teacherId - ID der Lehrperson
 * @returns {Promise<boolean>} true, wenn bereits eine Meldung existiert, sonst false.
 */
async function checkTeachingDuty(
    semesterId: number,
    teacherId: number
): Promise<boolean> {
    try {
        const res = await TeachingDutyService.getTeachingDuties()
        const { data, error } = res
        if (error) {
            console.warn("Couldn't load teaching duties")
            return false
        }
        return data.some(
            (item) =>
                item.semesterPeriodId === semesterId &&
                item.teacherId === teacherId
        )
    } catch (error) {
        console.error('Error while checking teaching duties:', error)
        return false
    }
}

/**
 * Erstellt einen Kommentar und gibt dessen ID zurück.
 *
 * @param content - Inhalt des Kommentars
 * @returns {Promise<number>} Die ID des erstellten Kommentars oder 0 im Fehlerfall.
 */
async function createComment(content: string): Promise<number> {
    const newComment: ICreateCommentRequest = {
        userId: 1, // TO-DO: Dynamisch setzen
        commentContent: content,
        commentDate: new Date(),
    }
    try {
        const res = await CommentService.createComment(newComment)
        const { data, error } = res
        if (error) {
            console.error('Fehler beim Erstellen von Kommentar:', content)
            return 0
        }
        return data.commentId || 0
    } catch (error) {
        console.error('Fehler beim Erstellen des Kommentars:', error)
        return 0
    }
}

/**
 * Übermittelt das gesamte Formular.
 * Es werden zunächst Lehrdeputat, Lehrveranstaltungen, Betreuungen und Ermäßigungen erstellt.
 */
async function submitForm() {
    if (semester.value && teacher.value && individualDeputat.value > 0) {
        const exists = await checkTeachingDuty(semester.value, teacher.value)
        if (exists) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: 'Für dieses Semester und die Lehrperson wurde bereits eine Deputatsmeldung übermittelt',
                life: 5000,
            })
            return
        }
        // Lehrdeputat erstellen
        const newTeachingDuty: ICreateTeachingDutyRequest = {
            individualDuty: individualDeputat.value,
            sumBalance: 0,
            sumOrderedBalance: 0,
            semesterPeriodId: semester.value,
            teacherId: teacher.value,
        }
        try {
            const dutyRes =
                await TeachingDutyService.createTeachingDuty(newTeachingDuty)
            if (dutyRes.error) {
                console.error('Fehler beim Übermitteln von Deputat indv.')
            }
        } catch (error) {
            console.error(
                'Fehler beim Erstellen der Lehrdeputatsmeldung:',
                error
            )
        }

        // Lehrveranstaltungen anlegen
        for (const course of courses.value) {
            if (course.name !== '' && course.sws != null) {
                let commentId: number | null = null
                if (course.comment !== '') {
                    commentId = await createComment(course.comment)
                }
                // Umwandlung des ordered-Werts (abhängig vom Datentyp)
                const orderedBoolean =
                    typeof course.ordered === 'boolean'
                        ? course.ordered
                        : Array.isArray(course.ordered) &&
                          course.ordered[0] === 'True'
                const newTeachingEvent: ICreateTeachingEventRequest = {
                    name: course.name,
                    semesterPeriodId: semester.value,
                    teacherId: teacher.value,
                    hours: course.sws,
                    ordered: orderedBoolean,
                    commentId: commentId,
                    programId: null,
                }
                try {
                    const eventRes =
                        await TeachingEventService.createTeachingEvent(
                            newTeachingEvent
                        )
                    if (eventRes.error) {
                        console.error('Fehler beim Erstellen von', course.name)
                    }
                } catch (error) {
                    console.error(
                        'Fehler beim Erstellen von Lehrveranstaltung:',
                        error
                    )
                }
            }
        }

        // Betreuungen anlegen
        for (const mentor of mentoring.value) {
            if (mentor.matriculationNumber && mentor.type != null) {
                let commentId: number | null = null
                if (mentor.comment !== '') {
                    commentId = await createComment(mentor.comment)
                }
                const newSupervision: ICreateSupervisionRequest = {
                    studentId: mentor.matriculationNumber,
                    semesterPeriodId: semester.value,
                    supervisionTypeId: mentor.type,
                    teacherId: teacher.value,
                    commentId: commentId,
                    supervisionShare: mentor.supervisionShare,
                }
                try {
                    const supervisionRes =
                        await SupervisionService.createSupervision(
                            newSupervision
                        )
                    if (supervisionRes.error) {
                        console.error(
                            'Fehler beim Erstellen von Betreuung für',
                            mentor.matriculationNumber
                        )
                    }
                } catch (error) {
                    console.error('Fehler beim Erstellen von Betreuung:', error)
                }
            }
        }

        // Ermäßigungen anlegen
        for (const reduction of reductions.value) {
            if (
                reduction.details !== '' &&
                reduction.type != null &&
                reduction.approvedBy !== ''
            ) {
                let commentId: number | null = null
                if (reduction.comment !== '') {
                    commentId = await createComment(reduction.comment)
                }
                const orderedBoolean =
                    typeof reduction.ordered === 'boolean'
                        ? reduction.ordered
                        : Array.isArray(reduction.ordered) &&
                          reduction.ordered[0] === 'True'
                const newDiscount: ICreateDiscountRequest = {
                    semesterPeriodId: semester.value,
                    teacherId: teacher.value,
                    commentId: commentId,
                    discountTypeId: reduction.type,
                    ordered: orderedBoolean,
                    approvalDate: reduction.approvedOn,
                    supervisor: reduction.approvedBy,
                    description: reduction.details,
                    scope: reduction.sws,
                }
                try {
                    const discountRes =
                        await DiscountService.createDiscount(newDiscount)
                    if (discountRes.error) {
                        console.error(
                            'Fehler beim Erstellen von Ermäßigung',
                            reduction.details
                        )
                    }
                } catch (error) {
                    console.error(
                        'Fehler beim Erstellen von Ermäßigung:',
                        error
                    )
                }
            }
        }

        resetForm()
        toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Deputatmeldung erfolgreich übermittelt',
            life: 3000,
        })
    } else {
        toast.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Deputatmeldung konnte nicht übermittelt werden',
            life: 5000,
        })
        console.log('Nicht alle Felder ausgefüllt')
    }
    display.value = false
}

// --------------------------
// Laden von Daten (Optionen für Select-Felder, Evaluation Settings)
// --------------------------

async function loadMentoringTypes() {
    const data = await handleServiceCall(
        SupervisionTypeService.getSupervisionTypes(),
        null,
        'Fehler beim Laden der Betreuungstypen'
    )
    if (data) {
        mentoringTypes.value = data.map((st) => ({
            label: st.typeOfSupervision,
            value: st.typeOfSupervisionId,
            calculation: st.calculationFactor,
        }))
    }
}

async function loadReductionTypes() {
    const data = await handleServiceCall(
        DiscountTypeService.getDiscountTypes(),
        null,
        'Fehler beim Laden der Ermäßigungstypen'
    )
    if (data) {
        reductionTypes.value = data.map((dt) => ({
            label: dt.discountType,
            value: dt.discountTypeId,
        }))
    }
}

async function loadSemesters() {
    const data = await handleServiceCall(
        SemesterService.getSemesters(),
        null,
        'Fehler beim Laden der Semester'
    )
    if (data) {
        semesterSelect.value = data.map((sem) => ({
            label: sem.name,
            value: sem.id,
        }))
    }
}

async function loadTeachers() {
    const data = await handleServiceCall(
        TeacherService.getTeachers(),
        null,
        'Fehler beim Laden der Lehrpersonen'
    )
    if (data) {
        teacherSelect.value = data.map((t) => ({
            label: `${t.user.firstName} ${t.user.lastName}`,
            value: t.id,
        }))
    }
}

async function loadEvaluationSettings() {
    const data = await handleServiceCall(
        EvaluationSettingsService.getEvaluationSettings(),
        null,
        'Fehler beim Laden der Evaluation Settings'
    )
    if (data) {
        const maxSetting = data.find(
            (s: { key: string; value: string }) =>
                s.key === 'max_hours_supervisions'
        )
        maxSupervisions.value = maxSetting ? parseFloat(maxSetting.value) : 3.0
    }
}

// Lifecycle-Hook: Laden aller nötigen Daten beim Mounten der Komponente
onMounted(async () => {
    await loadMentoringTypes()
    await loadReductionTypes()
    await loadSemesters()
    await loadTeachers()
    await loadEvaluationSettings()
})
</script>

<template>
    <div>
        <!-- Formularkopf: Auswahl von Lehrperson, Semester und individuellem Deputat -->
        <form class="flex w-full flex-col" @submit.prevent="submitForm">
            <div class="card">
                <div class="mb-4 flex flex-wrap items-center justify-between">
                    <div class="flex items-center gap-2">
                        <h1 class="text-xl font-semibold">
                            Deputatsmeldung für
                        </h1>
                        <FloatLabel variant="on">
                            <Select
                                v-model="teacher"
                                option-label="label"
                                option-value="value"
                                :options="teacherSelect"
                                :style="{ width: '180px' }"
                            />
                            <label class="mb-2 block text-lg font-medium"
                                >Lehrperson</label
                            >
                        </FloatLabel>
                        <h1 class="text-xl font-semibold">im</h1>
                        <FloatLabel variant="on">
                            <Select
                                v-model="semester"
                                option-label="label"
                                option-value="value"
                                :options="semesterSelect"
                                :style="{ width: '180px' }"
                            />
                            <label class="mb-2 block text-lg font-medium"
                                >Semester</label
                            >
                        </FloatLabel>
                    </div>
                    <div class="flex items-center gap-2">
                        <p class="text-m font-semibold">
                            Individuelles Lehrdeputat:
                        </p>
                        <FloatLabel variant="on">
                            <InputNumber
                                v-model="individualDeputat"
                                placeholder="18"
                                :min="0"
                                :step="1"
                                :min-fraction-digits="2"
                                :max-fraction-digits="2"
                                showButtons
                            />
                            <label class="mb-2 block text-lg font-medium"
                                >Umfang (SWS)</label
                            >
                        </FloatLabel>
                        <Button
                            label="Abschicken"
                            class="p-button-success"
                            icon="pi pi-send"
                            @click="openDialog"
                        />
                    </div>
                    <Dialog
                        v-model:visible="display"
                        header="Deputat melden"
                        :breakpoints="{ '960px': '75vw' }"
                        :style="{ width: '30vw' }"
                        :modal="true"
                    >
                        <p class="m-0 leading-normal">
                            Bitte überprüfen Sie Ihre Eingaben sorgfältig! Sind
                            Sie sicher, dass alle Angaben korrekt sind?
                        </p>
                        <p class="m-0 leading-normal">
                            Falls alles korrekt ist, klicken Sie auf
                            "Abschicken", um fortzufahren. Andernfalls
                            korrigieren Sie bitte Ihre Eingaben.
                        </p>
                        <template #footer>
                            <Button
                                type="submit"
                                label="Abschicken"
                                class="p-button-success"
                                icon="pi pi-send"
                                @click="submitForm"
                            />
                        </template>
                    </Dialog>
                </div>
                <div class="flex items-center justify-end gap-2">
                    <p class="text-m font-semibold">
                        Vorläufig berechnetes Saldo:
                    </p>
                    <p
                        :style="{
                            color: balanceDifference < 0 ? 'red' : 'green',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                        }"
                    >
                        {{ balanceDifference.toFixed(2) }} SWS
                    </p>
                </div>
            </div>

            <!-- Abschnitt für Lehrveranstaltungen -->
            <CoursesSection v-model:courses="courses" :sum="coursesSum" />

            <!-- Abschnitt für Betreuungen -->
            <MentoringSection
                v-model:mentoring="mentoring"
                :mentoringTypes="mentoringTypes"
                :sum="mentoringSum"
                :maxSupervisions="maxSupervisions"
            />

            <!-- Abschnitt für Ermäßigungen -->
            <DiscountsSection
                v-model:reductions="reductions"
                :reductionTypes="reductionTypes"
                :sum="reductionsSum"
            />
        </form>
    </div>
</template>
