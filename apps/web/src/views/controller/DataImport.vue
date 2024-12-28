<script lang="ts">
import { ComponentOptions } from 'vue';
import { ISupervisionTypeResponse, IDiscountTypeResponse, ISemesterResponse, ITeacherResponse, ICreateTeachingEventRequest, ICreateSupervisionRequest, ICreateDiscountRequest } from '@workspace/shared'
import SupervisionTypeService from '@/service/supervisionType.service'
import SemesterService from '@/service/semester.service'
import TeacherService from '@/service/teacher.service'
import DiscountTypeService from '@/service/discountType.service'
import TeachingEventService from '@/service/teachingEvent.service'
import SupervisionService from '@/service/supervision.service'
import DiscountService from '@/service/discount.service'
import { useToast } from 'primevue/usetoast'

interface SelectOption {
    label: string;
    value: number;
}

export default {
  name: 'DeputatsAbrechnung',
  data(): {
    individualDeputat: number;
    semester: number;
    teacher: number;
    courses: { name: string; sws: number; ordered: boolean; comment: string }[];
    mentoring: { type: number; matriculationNumber: number; comment: string }[];
    reductions: { type: number; details: string; approvedBy: string; approvedOn: Date; sws: number; comment: string; ordered: boolean }[];
    display: boolean;
    mentoringTypes: SelectOption[];
    reductionTypes: SelectOption[];
    semesterSelect: SelectOption[];
    teacherSelect: SelectOption[];
    courseCommentOverlay: boolean;
    mentorCommentOverlay: boolean;
    reductionCommentOverlay: boolean;
  } {
    return {
      individualDeputat: 0,
      semester: 0,
      teacher: 0,
      courses: [{ name: '', sws: 0, ordered: false, comment: '' }],
      mentoring: [{ type: 0, matriculationNumber: 0, comment: '' }],
      reductions: [{ type: 0, details: '', approvedBy: '', approvedOn: new Date(), sws: 0, comment: '', ordered: false }],
      display: false,
      courseCommentOverlay: false,
      mentorCommentOverlay: false,
      reductionCommentOverlay: false,
      mentoringTypes: [] as SelectOption[],
      reductionTypes: [] as SelectOption[],
      semesterSelect: [] as SelectOption[],
      teacherSelect: [] as SelectOption[],
    };
  },
  methods: {
    addCourse() {
      this.courses.push({ name: '', sws: 0, ordered: false, comment: '' });
    },
    removeCourse(index: number) {
      this.courses.splice(index, 1);
    },
    addMentoring() {
      this.mentoring.push({ type: 0, matriculationNumber: 0, comment: '' });
    },
    removeMentoring(index: number) {
      this.mentoring.splice(index, 1);
    },
    addReduction() {
      this.reductions.push({ type: 0, details: '', approvedBy: '', approvedOn: new Date(), sws: 0, comment: '', ordered: false });
    },
    removeReduction(index: number) {
      this.reductions.splice(index, 1);
    },
    openDialog() {
      this.display = true;
    },
    resetForm() {
        this.individualDeputat = 0;
        this.teacher = 0;
        this.semester = 0;
        this.courses = [{ name: '', sws: 0, ordered: false, comment: '' }];
        this.mentoring = [{ type: 0, matriculationNumber: 0, comment: '' }];
        this.reductions = [{ type: 0, details: '', approvedBy: '', approvedOn: new Date(), sws: 0, comment: '', ordered: false }];
    },
    submitForm() {
        if(this.semester && this.teacher > 0) {
            for (const course of this.courses) {
                if (course.name && course.sws !== null) {

                    const orderedBoolean = Array.isArray(course.ordered) && course.ordered[0] === "True";

                    const newTeachingEvent: ICreateTeachingEventRequest = {
                        name: course.name,
                        semesterPeriodId: this.semester,
                        teacherId: this.teacher,
                        hours: course.sws,
                        ordered: orderedBoolean,
                        commentId: null,
                        programId: null,
                    }

                    TeachingEventService.createTeachingEvent(newTeachingEvent).then((res) => {
                        const { data, error } = res;
                        if (error)
                            console.log("Fehler beim Erstellen von " + course.name)
                    })
                }
            }

            for (const mentoring of this.mentoring) {
                if (mentoring.matriculationNumber && mentoring.type !== null) {

                    const newSupervision: ICreateSupervisionRequest = {
                        studentId: mentoring.matriculationNumber,
                        semesterPeriodId: this.semester,
                        supervisionTypeId: mentoring.type,
                        teacherId: this.teacher,
                        commentId: null,
                    }

                    SupervisionService.createSupervision(newSupervision).then((res) => {
                        const { data, error } = res
                        if (error)
                        console.log("Fehler beim Erstellen von " + mentoring.matriculationNumber)
                    })
                }
            }

            for (const reduction of this.reductions) {
                if (reduction.details && reduction.type && reduction.approvedBy !== null) {

                    const orderedBoolean = Array.isArray(reduction.ordered) && reduction.ordered[0] === "True";

                    const newDiscount: ICreateDiscountRequest = {
                        semesterPeriodId: this.semester,
                        teacherId: this.teacher,
                        commentId: null,
                        discountTypeId: reduction.type,
                        ordered: orderedBoolean,
                        approvalDate: reduction.approvedOn,
                        supervisor: reduction.approvedBy,
                        description: reduction.details,
                        scope: reduction.sws,
                    }

                    DiscountService.createDiscount(newDiscount).then((res) => {
                        const { data, error } = res
                        if (error)
                        console.log("Fehler beim Erstellen von " + reduction.details)
                    })
                }
            }

            // toast.add({
            //     severity: 'success',
            //     summary: 'Successful',
            //     detail: 'Deputatmeldung erfolgreich übermittelt',
            //     life: 3000,
            // })
        } else {
            // toast.add({
            //     severity: 'error',
            //     summary: 'Fehler',
            //     detail: 'Deputatmeldung konnte nicht übermittelt werden',
            //     life: 5000,
            // })
        }
        this.resetForm();
        this.display = false;
    },
    async loadMentoringTypes() {
        SupervisionTypeService.getSupervisionTypes().then((res) => {
            const { data, error } = res
            if (error) {
                console.warn("Couldn`t load supervisionTypes")
            } else {
                this.mentoringTypes = data.map((supervisionType: ISupervisionTypeResponse) => ({
                    label: supervisionType.typeOfSupervision,
                    value: supervisionType.typeOfSupervisionId,
                }));
            }
        }) 
    },
    async loadReductionTypes() {
        DiscountTypeService.getDiscountTypes().then((res) => {
            const { data, error } = res
            if (error) {
                console.warn("Couldn`t load reductionTypes")
            } else {
                this.reductionTypes = data.map((reductionType: IDiscountTypeResponse) => ({
                    label: reductionType.discountType,
                    value: reductionType.discountTypeId,
                }));
            }
        }) 
    },
    async loadSemesters() {
        SemesterService.getSemesters().then((res) => {
            const { data, error } = res
            if (error) {
                console.warn("[Discount-Overview] Couldn`t load semster")
            } else {
                this.semesterSelect = data.map((semester: ISemesterResponse) => ({
                    label: semester.name,
                    value: semester.id,
                }));
            }
        }) 
    },
    async loadTeachers() {
        TeacherService.getTeachers().then((res) => {
            const { data, error } = res
            if (error) {
                console.warn("[Discount-Overview] Couldn`t load teachers")
            } else {
                this.teacherSelect = data.map((teacher: ITeacherResponse) => ({
                    label: teacher.firstName + " " + teacher.lastName,
                    value: teacher.id,
                }));
            }
        })
    },
  },
  async mounted() {
    await this.loadMentoringTypes();
    await this.loadReductionTypes();
    await this.loadSemesters();
    await this.loadTeachers();
  },
} as ComponentOptions;
</script>


<template>
    <div>
        <Form
            v-slot=""
            class="flex w-full flex-col"
            @submit="submitForm"
        >
            <div class="card flex flex-wrap items-start items-center justify-between">
                <div class="flex items-center gap-2">
                    <h1 class="text-xl font-semibold">Deputatsmeldung für </h1>
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
                    <h1 class="text-xl font-semibold"> im </h1>
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
                    <p class="text-m font-semibold">Individuelles Lehrdeputat: </p>
                    <FloatLabel variant="on">
                        <InputNumber
                            v-model="individualDeputat"
                            label-id="indvDeputat"
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
                    <Dialog
                        v-model:visible="display"
                        header="Deputat melden"
                        :breakpoints="{ '960px': '75vw' }"
                        :style="{ width: '30vw' }"
                        :modal="true"
                    >
                        <p class="m-0 leading-normal">
                            Bitte überprüfen Sie ihre Eingaben sorgfältig! Sind sie sicher, dass alle Angaben korrekt sind? 
                        </p>
                        <p class="m-0 leading-normal">
                            Falls alles korrekt ist, klicken Sie auf "Abschicken", um fortzufahren. Andernfalls, korrigieren Sie bitte Ihre Eingaben vor dem Abschicken.
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
            </div>

            <div class="card courses">
                <div class="flex mb-4 gap-4 items-center">
                    <h2 class="text-xl font-semibold">Lehrveranstaltungen</h2>
                    <Button
                        icon="pi pi-info-circle"
                        severity="info"
                        type="button"
                        v-tooltip="'*Lehrveranstaltungen, die nicht in jeder Woche der Vorlesungszeit stattfinden, sind in SWS umzurechnen (Gesamtstunden geteilt durch 15)'"
                        raised
                        rounded
                        outlined
                    />
                </div>
                <!-- <p class="mb-4 text-xs">*Lehrveranstaltungen, die nicht in jeder Woche der Vorlesungszeit stattfinden, sind in SWS umzurechnen (Gesamtstunden geteilt durch 15)</p> -->
                <div v-for="(course, index) in courses" :key="index" class="course-entry flex items-center gap-4 mb-4">
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
                        />
                        <label
                            for="sws-course"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Umfang (SWS)*</label
                        >
                    </FloatLabel>
                    <div class="flex items-center mr-4">
                        <label for="course.ordered" class="mr-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
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
                        @click="(courseCommentOverlay = true)"
                    />
                    <Drawer
                        v-model:visible="courseCommentOverlay"
                        header="Kommentar zur Lehrveranstaltung"
                        position="right"
                    >
                        <div class="flex flex-wrap flex-col gap-4">
                            <Textarea 
                                v-model="course.comment"
                                id="comment" 
                                rows="8" 
                            />
                            <Button
                                label="Speichern"
                                class="p-button-success"
                                icon="pi pi-save"
                                @click=""
                            />
                        </div>
                    </Drawer>
                    <!--TO-DO: Kommentar speichern -->
                </div>
                <Button
                    label="Lehrveranstaltung hinzufügen"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addCourse"
                />
            </div>

            <div class="card mentoring">
                <div class="flex mb-4 gap-4 items-center">
                    <h2 class="text-xl font-semibold">Betreuungen</h2>
                    <Button
                        icon="pi pi-info-circle"
                        severity="info"
                        type="button"
                        v-tooltip="'gemäß §4 Abs. 5 LVV max. 3 SWS anrechenbar'"
                        raised
                        rounded
                        outlined
                    />
                </div>
                <div v-for="(mentor, index) in mentoring" :key="index" class="course-entry flex flex-wrap gap-4 mb-4">
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
                        @click="(mentorCommentOverlay = true)"
                    />
                    <Drawer
                        v-model:visible="mentorCommentOverlay"
                        header="Kommentar zur Betreuung"
                        position="right"
                    >
                        <div class="flex flex-wrap flex-col gap-4">
                            <Textarea 
                                v-model="mentor.comment"
                                id="comment" 
                                rows="8" 
                            />
                            <Button
                                label="Speichern"
                                class="p-button-success"
                                icon="pi pi-save"
                                @click=""
                            />
                        </div>
                    </Drawer>
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
                <div v-for="(reduction, index) in reductions" :key="index" class="course-entry flex gap-4 mb-8">
                    <div class="flex-col">
                        <div class="flex gap-4 mb-4">
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
                                    v-tooltip="'Kurze Beschreibung der Ermäßigung'"
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
                                <label for="reduction.ordered" class="mr-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
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
                            @click="(reductionCommentOverlay = true)"
                        />
                        </div>
                    </div>
                    <Drawer
                        v-model:visible="reductionCommentOverlay"
                        header="Kommentar zur Ermäßigung"
                        position="right"
                    >
                        <div class="flex flex-wrap flex-col gap-4">
                            <Textarea 
                                v-model="reduction.comment"
                                id="comment" 
                                rows="8" 
                            />
                            <Button
                                label="Speichern"
                                class="p-button-success"
                                icon="pi pi-save"
                                @click=""
                            />
                        </div>
                    </Drawer>
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