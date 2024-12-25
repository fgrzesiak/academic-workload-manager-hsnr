<script lang="ts">
// import { Form } from '@primevue/forms'
// import { Checkbox } from 'primevue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DeputatsAbrechnung',
  setup() {
    const individualDeputat = ref<number | null>(null);

    const courses = ref([
      { name: '', sws: null, ordered: false, comment: '', },
    ]);

    const mentoring = ref([
      { type: '', matriculationNumber: '', comment: '', },
    ]);

    const reductions = ref([
      { type: '', details: '', approvedBy: '', approvedOn: new Date(), sws: null, comment: '', ordered: false, },
    ]);

    const mentoringTypes = [
      'Bachelorarbeit',
      'Masterarbeit',
      'Zweitprüfer',
      'Praxissemester',
    ];

    const reductionTypes = [
      'Funktion/Aufgabe',
      'Forschung/Entwicklung',
      'Gesetzlich',
    ];

    const addCourse = () => {
      courses.value.push({ name: '', sws: null, ordered: false, comment: '', });
    };

    const removeCourse = (index: number) => {
      courses.value.splice(index, 1);
    };

    const addMentoring = () => {
      mentoring.value.push({ type: '', matriculationNumber: '', comment: '', });
    };

    const removeMentoring = (index: number) => {
      mentoring.value.splice(index, 1);
    };

    const addReduction = () => {
      reductions.value.push({ type: '', details: '', approvedBy: '', approvedOn: new Date(), sws: null, comment: '', ordered: false, });
    };

    const removeReduction = (index: number) => {
      reductions.value.splice(index, 1);
    };

    const display = ref(false);
    const courseCommentOverlay = ref(false);
    const mentorCommentOverlay = ref(false);
    const reductionCommentOverlay = ref(false);

    const openDialog = () => {
        display.value = true;
    };

    const closeDialog = () => {
        const formData = {
            individualDeputat: individualDeputat.value,
            courses: courses.value,
            mentoring: mentoring.value,
            reductions: reductions.value,
        };
        console.log('Form Data:', formData);

        display.value = false;
    };

    const submitForm = () => {
      const formData = {
        individualDeputat: individualDeputat.value,
        courses: courses.value,
        mentoring: mentoring.value,
        reductions: reductions.value,
      };
      console.log('Form Data:', formData);
    };

    return {
      individualDeputat,
      courses,
      mentoring,
      reductions,
      mentoringTypes,
      reductionTypes,
      addCourse,
      removeCourse,
      addMentoring,
      removeMentoring,
      addReduction,
      removeReduction,
      openDialog,
      closeDialog,
      display,
      courseCommentOverlay,
      mentorCommentOverlay,
      reductionCommentOverlay,
      submitForm,
    };
  },
});
</script>

<template>
    <div>
        <Form
            v-slot=""
            class="flex w-full flex-col"
            @submit="submitForm"
        >
            <div class="card flex flex-wrap items-start items-center justify-between">
                <h1 class="mb-4 text-xl font-semibold">Deputatsmeldung für SS24</h1>
                <div class="flex items-center gap-2">
                    <p class="text-m font-semibold">Individuelles Lehrdeputat: </p>
                    <FloatLabel variant="on">
                        <InputNumber
                            v-model="individualDeputat"
                            label-id="indvDeputat"
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
                            Bitte überprüfen Sie ihre EIngaben sorgfältig! Sind sie sicher, dass alle Angaben korrekt sind? 
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
                            @click="closeDialog"
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
                            label-id="mentor-type"
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
                        <InputText
                            label-id="mentor-matriculationNumber"
                            v-model="mentor.matriculationNumber"
                            v-tooltip="'Matrikelnummer des betreuten Studenten'"
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
                                    label-id="reduction-type"
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