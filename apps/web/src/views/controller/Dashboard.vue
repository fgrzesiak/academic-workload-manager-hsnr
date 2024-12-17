<script lang="ts">
import { Form } from '@primevue/forms'
import { Checkbox } from 'primevue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DeputatsAbrechnung',
  setup() {
    const individualDeputat = ref<number | null>(null);

    const courses = ref([
      { name: '', sws: null, ordered: false },
    ]);

    const mentoring = ref([
      { type: '', matriculationNumber: null },
    ]);

    const reductions = ref([
      { type: '', details: '', approvedBy: '', approvedOn: new Date(), sws: null },
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
      courses.value.push({ name: '', sws: null, ordered: false });
    };

    const removeCourse = (index: number) => {
      courses.value.splice(index, 1);
    };

    const addMentoring = () => {
      mentoring.value.push({ type: '', matriculationNumber: null });
    };

    const removeMentoring = (index: number) => {
      mentoring.value.splice(index, 1);
    };

    const addReduction = () => {
      reductions.value.push({ type: '', details: '', approvedBy: '', approvedOn: new Date(), sws: null });
    };

    const removeReduction = (index: number) => {
      reductions.value.splice(index, 1);
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
                        type="submit"
                        label="Abschicken"
                        class="p-button-success"
                        icon="pi pi-send"
                    />
                </div>
            </div>

            <div class="card courses">
                <h2 class="mb-4 text-xl font-semibold">Lehrveranstaltungen</h2>
                <div v-for="(course, index) in courses" :key="index" class="course-entry flex gap-4 mb-4">
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
                            >Umfang (SWS)</label
                        >
                    </FloatLabel>
                    <label
                        for="course.ordered"
                        class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                        >Angeordnet?</label
                    >
                    <Checkbox 
                        v-model="course.ordered"
                        label-id="course.ordered"
                        placeholder="Angeordnet"
                    />
                    <Button
                        label="Entfernen"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="removeCourse(index)"
                    />
                </div>
                <Button
                    label="Weitere Eingabe hinzufügen"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addCourse"
                />
            </div>

            <div class="card mentoring">
                <h2 class="mb-4 text-xl font-semibold">Betreuungen</h2>
                <div v-for="(mentor, index) in mentoring" :key="index" class="course-entry flex flex-wrap gap-4 mb-4">
                    <FloatLabel variant="on">
                        <Select
                            v-model="mentor.type"
                            label-id="mentor-type"
                            name="type"
                            :options="mentoringTypes"
                            :style="{ width: '180px' }"
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
                        />
                        <label
                            for="mentor-matriculationNumber"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Zugehörige Matrikelnummer</label
                        >
                    </FloatLabel>
                    <Button
                        label="Entfernen"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="removeMentoring(index)"
                    />
                </div>
                <Button
                    label="Weitere Eingabe hinzufügen"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addMentoring"
                />
            </div>

            <div class="card discounts">
                <h2 class="mb-4 text-xl font-semibold">Ermäßigungen</h2>
                <div v-for="(reduction, index) in reductions" :key="index" class="course-entry flex gap-4 mb-4">
                    <FloatLabel variant="on">
                        <Select
                            v-model="reduction.type"
                            label-id="reduction-type"
                            name="type"
                            :options="reductionTypes"
                            :style="{ width: '180px' }"
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
                        />
                        <label
                            for="reduction-details"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Beschreibung der Ermäßigung</label
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
                    <Button
                        label="Entfernen"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="removeReduction(index)"
                    />
                </div>
                <Button
                    label="Weitere Eingabe hinzufügen"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="addReduction"
                />
            </div>
        </Form>
    </div>
</template>