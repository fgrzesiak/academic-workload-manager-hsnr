<script lang="ts">
import { ComponentOptions } from 'vue'
import {
    ISupervisionTypeResponse,
    IDiscountTypeResponse,
    ISemesterResponse,
    ITeacherResponse,
    ICreateTeachingEventRequest,
    ICreateSupervisionRequest,
    ICreateDiscountRequest,
    ICreateTeachingDutyRequest,
    ICreateCommentRequest,
} from '@workspace/shared'
import SupervisionTypeService from '@/service/supervisionType.service'
import SemesterService from '@/service/semester.service'
import TeacherService from '@/service/teacher.service'
import DiscountTypeService from '@/service/discountType.service'
import TeachingEventService from '@/service/teachingEvent.service'
import SupervisionService from '@/service/supervision.service'
import DiscountService from '@/service/discount.service'
import TeachingDutyService from '@/service/teachingDuty.service'
import CommentService from '@/service/comment.service'
import { useToast } from 'primevue/usetoast'

interface SelectOption {
    label: string
    value: number
}

interface SelectOptionCalculation {
    label: string
    value: number
    calculation: number
}

export default {
    name: 'DeputatsAbrechnung',
    data(): {
        individualDeputat: number
        semester: number
        teacher: number
        courses: {
            name: string
            sws: number
            ordered: boolean
            comment: string
            showComment: boolean
        }[]
        mentoring: {
            type: number
            matriculationNumber: number
            comment: string
            showComment: boolean
        }[]
        reductions: {
            type: number
            details: string
            approvedBy: string
            approvedOn: Date
            sws: number
            comment: string
            showComment: boolean
            ordered: boolean
        }[]
        display: boolean
        mentoringTypes: SelectOptionCalculation[]
        reductionTypes: SelectOption[]
        semesterSelect: SelectOption[]
        teacherSelect: SelectOption[]
        mentoringSum: number
        coursesSum: number
        reductionsSum: number
        totalBalance: number
        balanceDifference: number
        toast: any
    } {
        return {
            individualDeputat: 18,
            semester: 0,
            teacher: 0,
            courses: [
                {
                    name: '',
                    sws: 0,
                    ordered: false,
                    comment: '',
                    showComment: false,
                },
            ],
            mentoring: [
                {
                    type: 0,
                    matriculationNumber: 0,
                    comment: '',
                    showComment: false,
                },
            ],
            reductions: [
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
            ],
            display: false,
            mentoringTypes: [] as SelectOptionCalculation[],
            reductionTypes: [] as SelectOption[],
            semesterSelect: [] as SelectOption[],
            teacherSelect: [] as SelectOption[],
            mentoringSum: 0,
            coursesSum: 0,
            reductionsSum: 0,
            totalBalance: 0,
            balanceDifference: 0,
            toast: null,
        }
    },
    watch: {
        mentoring: {
            handler() {
                this.calculateMentoringSum()
                this.calculateTotalBalance()
            },
            deep: true,
        },
        courses: {
            handler() {
                this.calculateCoursesSum()
                this.calculateTotalBalance()
            },
            deep: true,
        },
        reductions: {
            handler() {
                this.calculateReductionsSum()
                this.calculateTotalBalance()
            },
            deep: true,
        },
        individualDeputat: {
            handler() {
                this.calculateBalanceDifference()
            },
        },
        totalBalance: {
            handler() {
                this.calculateBalanceDifference()
            },
        },
    },
    methods: {
        addCourse() {
            this.courses.push({
                name: '',
                sws: 0,
                ordered: false,
                comment: '',
                showComment: false,
            })
        },
        removeCourse(index: number) {
            this.courses.splice(index, 1)
        },
        addMentoring() {
            this.mentoring.push({
                type: 0,
                matriculationNumber: 0,
                comment: '',
                showComment: false,
            })
        },
        removeMentoring(index: number) {
            this.mentoring.splice(index, 1)
        },
        addReduction() {
            this.reductions.push({
                type: 0,
                details: '',
                approvedBy: '',
                approvedOn: new Date(),
                sws: 0,
                comment: '',
                showComment: false,
                ordered: false,
            })
        },
        removeReduction(index: number) {
            this.reductions.splice(index, 1)
        },
        openDialog() {
            this.display = true
        },
        resetForm() {
            this.individualDeputat = 18
            this.teacher = 0
            this.semester = 0
            this.courses = [
                {
                    name: '',
                    sws: 0,
                    ordered: false,
                    comment: '',
                    showComment: false,
                },
            ]
            this.mentoring = [
                {
                    type: 0,
                    matriculationNumber: 0,
                    comment: '',
                    showComment: false,
                },
            ]
            this.reductions = [
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
            this.mentoringSum = 0
            this.coursesSum = 0
            this.reductionsSum = 0
            this.totalBalance = 0
            this.balanceDifference = 0
        },
        async checkTeachingDuty(
            semesterId: number,
            teacher: number
        ): Promise<boolean> {
            try {
                const res = await TeachingDutyService.getTeachingDuties()
                const { data, error } = res
                if (error) {
                    console.warn("Couldn't load teachingDuties")
                    return false
                }
                return data.some(
                    (item) =>
                        item.semesterPeriodId === semesterId &&
                        item.teacherId === teacher
                )
            } catch (error) {
                console.error('Error while checking teaching duties:', error)
                return false
            }
        },
        calculateMentoringSum() {
            if (!this.mentoringTypes || this.mentoring.length === 0) {
                this.mentoringSum = 0
                return
            }

            this.mentoringSum = this.mentoring.reduce((sum, mentor) => {
                const selectedType = this.mentoringTypes.find(
                    (type) => type.value === mentor.type
                )
                return sum + (selectedType?.calculation || 0)
            }, 0)
        },
        calculateCoursesSum() {
            this.coursesSum = this.courses.reduce((sum, course) => {
                return sum + (course.sws || 0)
            }, 0)
        },
        calculateReductionsSum() {
            this.reductionsSum = this.reductions.reduce((sum, reduction) => {
                return sum + (reduction.sws || 0)
            }, 0)
        },
        calculateTotalBalance() {
            this.totalBalance =
                this.coursesSum + this.mentoringSum + this.reductionsSum
        },
        calculateBalanceDifference() {
            this.balanceDifference = this.totalBalance - this.individualDeputat
        },
        async createComment(content: string): Promise<number> {
            const newComment: ICreateCommentRequest = {
                userId: 1, // TO-DO: nach Prototyp muss das dynamisch gesetzt werden
                commentContent: content,
                commentDate: new Date(),
            }

            try {
                const res = await CommentService.createComment(newComment)
                const { data, error } = res

                if (error) {
                    console.log(
                        'Fehler beim Erstellen von Kommentar zu ' + content
                    )
                    return 0
                } else {
                    return data.commentId || 0
                }
            } catch (error) {
                console.error('Fehler beim Erstellen des Kommentars:', error)
                return 0
            }
        },
        async submitForm() {
            if (this.semester && this.teacher && this.individualDeputat > 0) {
                const exists = await this.checkTeachingDuty(
                    this.semester,
                    this.teacher
                )

                if (!exists) {
                    const newTeachingDuty: ICreateTeachingDutyRequest = {
                        individualDuty: this.individualDeputat,
                        sumBalance: 0,
                        sumOrderedBalance: 0,
                        semesterPeriodId: this.semester,
                        teacherId: this.teacher,
                    }

                    TeachingDutyService.createTeachingDuty(
                        newTeachingDuty
                    ).then((res) => {
                        const { error } = res
                        if (error)
                            console.log(
                                'Fehler beim Übermitteln von Deputat indv.'
                            )
                    })

                    for (const course of this.courses) {
                        if (course.name !== '' && course.sws !== null) {
                            let commentId: number | null = null

                            if (course.comment !== '') {
                                commentId = await this.createComment(
                                    course.comment
                                )
                            }

                            const orderedBoolean =
                                Array.isArray(course.ordered) &&
                                course.ordered[0] === 'True'

                            const newTeachingEvent: ICreateTeachingEventRequest =
                                {
                                    name: course.name,
                                    semesterPeriodId: this.semester,
                                    teacherId: this.teacher,
                                    hours: course.sws,
                                    ordered: orderedBoolean,
                                    commentId: commentId,
                                    programId: null,
                                }

                            TeachingEventService.createTeachingEvent(
                                newTeachingEvent
                            ).then((res) => {
                                const { error } = res
                                if (error)
                                    console.log(
                                        'Fehler beim Erstellen von ' +
                                            course.name
                                    )
                            })
                        }
                    }

                    for (const mentoring of this.mentoring) {
                        if (
                            mentoring.matriculationNumber &&
                            mentoring.type !== null
                        ) {
                            let commentId: number | null = null

                            if (mentoring.comment !== '') {
                                commentId = await this.createComment(
                                    mentoring.comment
                                )
                            }

                            console.log(commentId)

                            const newSupervision: ICreateSupervisionRequest = {
                                studentId: mentoring.matriculationNumber,
                                semesterPeriodId: this.semester,
                                supervisionTypeId: mentoring.type,
                                teacherId: this.teacher,
                                commentId: commentId,
                            }

                            SupervisionService.createSupervision(
                                newSupervision
                            ).then((res) => {
                                const { error } = res
                                if (error)
                                    console.log(
                                        'Fehler beim Erstellen von ' +
                                            mentoring.matriculationNumber
                                    )
                            })
                        }
                    }

                    for (const reduction of this.reductions) {
                        if (
                            reduction.details !== '' &&
                            reduction.type !== null &&
                            reduction.approvedBy !== ''
                        ) {
                            let commentId: number | null = null

                            if (reduction.comment !== '') {
                                commentId = await this.createComment(
                                    reduction.comment
                                )
                            }

                            console.log(commentId)

                            const orderedBoolean =
                                Array.isArray(reduction.ordered) &&
                                reduction.ordered[0] === 'True'

                            const newDiscount: ICreateDiscountRequest = {
                                semesterPeriodId: this.semester,
                                teacherId: this.teacher,
                                commentId: commentId,
                                discountTypeId: reduction.type,
                                ordered: orderedBoolean,
                                approvalDate: reduction.approvedOn,
                                supervisor: reduction.approvedBy,
                                description: reduction.details,
                                scope: reduction.sws,
                            }

                            DiscountService.createDiscount(newDiscount).then(
                                (res) => {
                                    const { error } = res
                                    if (error)
                                        console.log(
                                            'Fehler beim Erstellen von ' +
                                                reduction.details
                                        )
                                }
                            )
                        }
                    }

                    this.resetForm()

                    this.toast.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Deputatmeldung erfolgreich übermittelt',
                        life: 3000,
                    })
                } else {
                    this.toast.add({
                        severity: 'error',
                        summary: 'Fehler',
                        detail: 'Für dieses Semester und die Lehrperson wurde bereits eine Deputatsmeldung übermittelt',
                        life: 5000,
                    })
                    console.log('Gibt bereits eine Meldung')
                }
            } else {
                this.toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: 'Deputatmeldung konnte nicht übermittelt werden',
                    life: 5000,
                })
                console.log('Nicht alle Felder ausgefüllt')
            }
            this.display = false
        },
        async loadMentoringTypes() {
            SupervisionTypeService.getSupervisionTypes().then((res) => {
                const { data, error } = res
                if (error) {
                    console.warn('Couldn`t load supervisionTypes')
                } else {
                    this.mentoringTypes = data.map(
                        (supervisionType: ISupervisionTypeResponse) => ({
                            label: supervisionType.typeOfSupervision,
                            value: supervisionType.typeOfSupervisionId,
                            calculation: supervisionType.calculationFactor,
                        })
                    )
                }
            })
        },
        async loadReductionTypes() {
            DiscountTypeService.getDiscountTypes().then((res) => {
                const { data, error } = res
                if (error) {
                    console.warn('Couldn`t load reductionTypes')
                } else {
                    this.reductionTypes = data.map(
                        (reductionType: IDiscountTypeResponse) => ({
                            label: reductionType.discountType,
                            value: reductionType.discountTypeId,
                        })
                    )
                }
            })
        },
        async loadSemesters() {
            SemesterService.getSemesters().then((res) => {
                const { data, error } = res
                if (error) {
                    console.warn('Couldn`t load semster')
                } else {
                    this.semesterSelect = data.map(
                        (semester: ISemesterResponse) => ({
                            label: semester.name,
                            value: semester.id,
                        })
                    )
                }
            })
        },
        async loadTeachers() {
            TeacherService.getTeachers().then((res) => {
                const { data, error } = res
                if (error) {
                    console.warn('Couldn`t load teachers')
                } else {
                    this.teacherSelect = data.map(
                        (teacher: ITeacherResponse) => ({
                            label:
                                teacher.user.firstName +
                                ' ' +
                                teacher.user.lastName,
                            value: teacher.id,
                        })
                    )
                }
            })
        },
    },
    created() {
        this.toast = useToast()
    },
    async mounted() {
        await this.loadMentoringTypes()
        await this.loadReductionTypes()
        await this.loadSemesters()
        await this.loadTeachers()
    },
} as ComponentOptions
</script>

<template>
    <div>
        <Form v-slot="" class="flex w-full flex-col" @submit="submitForm">
            <div class="card">
                <div
                    class="flex flex-wrap items-start items-center justify-between mb-4"
                >
                    <div class="flex items-center gap-2">
                        <h1 class="text-xl font-semibold">Deputatsmeldung für</h1>
                        <FloatLabel variant="on">
                            <Select
                                v-model="teacher"
                                option-label="label"
                                option-value="value"
                                name="type"
                                :options="teacherSelect"
                                :style="{ width: '180px' }"
                            ></Select>
                            <label
                                for="mentor-type"
                                class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                >Lehrperson</label
                            >
                        </FloatLabel>
                        <h1 class="text-xl font-semibold">im</h1>
                        <FloatLabel variant="on">
                            <Select
                                v-model="semester"
                                option-label="label"
                                option-value="value"
                                name="type"
                                :options="semesterSelect"
                                :style="{ width: '180px' }"
                            ></Select>
                            <label
                                for="mentor-type"
                                class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
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
                                label-id="indvDeputat"
                                placeholder="18"
                                :min="0"
                            />
                            <label
                                for="indvDeputat"
                                class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
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
                            Bitte überprüfen Sie ihre Eingaben sorgfältig! Sind
                            sie sicher, dass alle Angaben korrekt sind?
                        </p>
                        <p class="m-0 leading-normal">
                            Falls alles korrekt ist, klicken Sie auf
                            "Abschicken", um fortzufahren. Andernfalls,
                            korrigieren Sie bitte Ihre Eingaben vor dem
                            Abschicken.
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
                <div class="flex items-center gap-2 justify-end">
                    <p class="text-m font-semibold">
                        Vorläufig berechnetes Saldo:
                    </p>
                    <p
                        class="text-m font-semibold"
                        :style="{ color: balanceDifference < 0 ? 'red' : 'green', fontWeight: 'bold', fontSize: '1.2rem' }"
                    >
                        {{ balanceDifference.toFixed(2) }} SWS
                    </p>
                </div>
            </div>

            <div class="card courses">
                <h2 class="mb-1 text-xl font-semibold">Lehrveranstaltungen</h2>
                <p class="mb-6 text-xs">
                    *Lehrveranstaltungen, die nicht in jeder Woche der
                    Vorlesungszeit stattfinden, sind in SWS umzurechnen
                    (Gesamtstunden geteilt durch 15)
                </p>
                <div
                    v-for="(course, index) in courses"
                    :key="index"
                    class="course-entry mb-4 flex items-center gap-4"
                >
                    <FloatLabel variant="on">
                        <InputText
                            label-id="name-course"
                            v-model="course.name"
                        />
                        <label
                            for="name-course"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Name der Veranstaltung</label
                        >
                    </FloatLabel>
                    <FloatLabel variant="on">
                        <InputNumber
                            label-id="sws-course"
                            v-model="course.sws"
                            :min="0"
                            :step="0.1"
                        />
                        <label
                            for="sws-course"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Umfang (SWS)*</label
                        >
                    </FloatLabel>
                    <div class="mr-4 flex items-center">
                        <label
                            for="course.ordered"
                            class="mr-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Angeordnet?</label
                        >
                        <Checkbox
                            id="course.ordered"
                            v-model="course.ordered"
                            name="option"
                            value="True"
                        />
                    </div>
                    <Button
                        label="Entfernen"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="removeCourse(index)"
                    />
                    <Button
                        label="Kommentar hinzufügen"
                        icon="pi pi-comments"
                        class="p-button-secondary"
                        @click="(course.showComment = true)"
                    />
                    <Drawer
                        v-model:visible="course.showComment"
                        header="Kommentar zur Lehrveranstaltung"
                        position="right"
                    >
                        <div class="flex flex-col flex-wrap gap-4">
                            <Textarea
                                v-model="course.comment"
                                id="comment"
                                rows="8"
                            />
                            <Button
                                label="Speichern"
                                class="p-button-success"
                                icon="pi pi-save"
                                @click="(course.showComment = false)"
                            />
                        </div>
                    </Drawer>
                </div>
                <div class="mb-4 flex-row items-center">
                    <p class="font-semibold">
                        Summe (SWS): {{ coursesSum.toFixed(2) }}
                    </p>
                </div>
                <Button
                    label="Lehrveranstaltung hinzufügen"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addCourse"
                />
            </div>

            <div class="card mentoring">
                <h2 class="mb-4 text-xl font-semibold">Betreuungen</h2>
                <div
                    v-for="(mentor, index) in mentoring"
                    :key="index"
                    class="course-entry mb-4 flex flex-wrap gap-4"
                >
                    <FloatLabel variant="on">
                        <Select
                            v-model="mentor.type"
                            option-label="label"
                            option-value="value"
                            name="type"
                            :options="mentoringTypes"
                            :style="{ width: '200px' }"
                        ></Select>
                        <label
                            for="mentor-type"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Art der Betreuung</label
                        >
                    </FloatLabel>
                    <FloatLabel variant="on">
                        <InputNumber
                            label-id="mentor-matriculationNumber"
                            v-model="mentor.matriculationNumber"
                            v-tooltip="'Matrikelnummer des betreuten Studenten'"
                            :useGrouping="false"
                            :min="0"
                        />
                        <label
                            for="mentor-matriculationNumber"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Matrikelnummer</label
                        >
                    </FloatLabel>
                    <Button
                        label="Entfernen"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="removeMentoring(index)"
                    />
                    <Button
                        label="Kommentar hinzufügen"
                        icon="pi pi-comments"
                        class="p-button-secondary"
                        @click="(mentor.showComment = true)"
                    />
                    <Drawer
                        v-model:visible="mentor.showComment"
                        header="Kommentar zur Betreuung"
                        position="right"
                    >
                        <div class="flex flex-col flex-wrap gap-4">
                            <Textarea
                                v-model="mentor.comment"
                                id="comment"
                                rows="8"
                            />
                            <Button
                                label="Speichern"
                                class="p-button-success"
                                icon="pi pi-save"
                                @click="(mentor.showComment = false)"
                            />
                        </div>
                    </Drawer>
                </div>
                <div class="mb-4 flex-row items-center">
                    <p class="font-semibold">
                        Summe (SWS): {{ mentoringSum.toFixed(3) }}
                    </p>
                    <p v-if="mentoringSum > 3.1" class="font-bold text-red-500">
                        Die maximal anrechenbaren SWS wurden überschritten!
                        (gemäß
                        <a
                            href="https://www.lexsoft.de/cgi-bin/lexsoft/justizportal_nrw.cgi?xid=3804662,5"
                            target="_blank"
                            ><u>§4 Abs. 5 LVV</u></a
                        >)
                    </p>
                </div>
                <Button
                    label="Betreuung hinzufügen"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addMentoring"
                />
            </div>

            <div class="card discounts">
                <h2 class="mb-4 text-xl font-semibold">Ermäßigungen</h2>
                <div
                    v-for="(reduction, index) in reductions"
                    :key="index"
                    class="course-entry mb-8 flex gap-4"
                >
                    <div class="flex-col">
                        <div class="mb-4 flex gap-4">
                            <FloatLabel variant="on">
                                <Select
                                    v-model="reduction.type"
                                    option-label="label"
                                    option-value="value"
                                    name="type"
                                    :options="reductionTypes"
                                    :style="{ width: '200px' }"
                                ></Select>
                                <label
                                    for="reduction-type"
                                    class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                    >Art der Ermäßigung</label
                                >
                            </FloatLabel>
                            <FloatLabel variant="on">
                                <InputText
                                    label-id="reduction-details"
                                    v-model="reduction.details"
                                    v-tooltip="
                                        'Kurze Beschreibung der Ermäßigung'
                                    "
                                />
                                <label
                                    for="reduction-details"
                                    class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                    >Beschreibung</label
                                >
                            </FloatLabel>
                            <FloatLabel variant="on">
                                <InputNumber
                                    label-id="sws-course"
                                    v-model="reduction.sws"
                                    :min="0"
                                    :step="0.1"
                                />
                                <label
                                    for="sws-course"
                                    class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                    >Umfang (SWS)</label
                                >
                            </FloatLabel>
                        </div>
                        <div class="flex gap-4">
                            <FloatLabel variant="on">
                                <DatePicker
                                    v-model="reduction.approvedOn"
                                    date-format="dd.mm.yy"
                                    placeholder="Datum auswählen"
                                />
                                <label
                                    for="reduction-approvedBy"
                                    class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                    >Genehmigt am</label
                                >
                            </FloatLabel>
                            <FloatLabel variant="on">
                                <InputText
                                    label-id="reduction-approvedBy"
                                    v-model="reduction.approvedBy"
                                />
                                <label
                                    for="reduction-approvedBy"
                                    class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                    >Genehmigt durch</label
                                >
                            </FloatLabel>
                            <div class="flex items-center">
                                <label
                                    for="reduction.ordered"
                                    class="mr-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                    >Angeordnet?</label
                                >
                                <Checkbox
                                    id="reduction.ordered"
                                    v-model="reduction.ordered"
                                    name="option"
                                    value="True"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex-col">
                        <div class="mb-4">
                            <Button
                                label="Entfernen"
                                icon="pi pi-trash"
                                class="p-button-danger"
                                @click="removeReduction(index)"
                            />
                        </div>
                        <div>
                            <Button
                                label="Kommentar hinzufügen"
                                icon="pi pi-comments"
                                class="p-button-secondary"
                                @click="(reduction.showComment = true)"
                            />
                        </div>
                    </div>
                    <Drawer
                        v-model:visible="reduction.showComment"
                        header="Kommentar zur Ermäßigung"
                        position="right"
                    >
                        <div class="flex flex-col flex-wrap gap-4">
                            <Textarea
                                v-model="reduction.comment"
                                id="comment"
                                rows="8"
                            />
                            <Button
                                label="Speichern"
                                class="p-button-success"
                                icon="pi pi-save"
                                @click="(reduction.showComment = false)"
                            />
                        </div>
                    </Drawer>
                </div>
                <div class="mb-4 flex-row items-center">
                    <p class="font-semibold">
                        Summe (SWS): {{ reductionsSum.toFixed(2) }}
                    </p>
                </div>
                <Button
                    label="Ermäßigung hinzufügen"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addReduction"
                />
            </div>
        </Form>
    </div>
</template>
