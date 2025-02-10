<script setup lang="ts">
/**
 * @file CoursesSection.vue
 * @description Komponente für den Bereich „Lehrveranstaltungen“.
 *              Hier können Lehrveranstaltungen (Kurse) hinzugefügt, bearbeitet und entfernt werden.
 *              Außerdem wird die Teilsumme der SWS berechnet und angezeigt.
 */

import { computed } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import Drawer from 'primevue/drawer'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

/**
 * Interface für einen Kurs.
 */
interface Course {
    name: string
    sws: number
    ordered: boolean
    comment: string
    showComment: boolean
}

// Props: v-model binding für courses und Anzeige der berechneten Summe
const props = defineProps<{
    courses: Course[]
    sum: number
}>()

const emits = defineEmits<{
    (e: 'update:courses', value: Course[]): void
}>()

// Computed Property für das Zwei-Wege-Binding (v-model)
const modelCourses = computed({
    get: () => props.courses,
    set: (val: Course[]) => emits('update:courses', val),
})

/**
 * Fügt einen leeren Kurs der Liste hinzu.
 */
function addCourse() {
    modelCourses.value.push({
        name: '',
        sws: 0,
        ordered: false,
        comment: '',
        showComment: false,
    })
}

/**
 * Entfernt den Kurs an der angegebenen Position.
 * @param index Index des zu entfernenden Kurses
 */
function removeCourse(index: number) {
    modelCourses.value.splice(index, 1)
}
</script>

<template>
    <div class="card courses">
        <h2 class="mb-1 text-xl font-semibold">Lehrveranstaltungen</h2>
        <p class="mb-6 text-xs">
            * Lehrveranstaltungen, die nicht in jeder Woche der Vorlesungszeit
            stattfinden, sind in SWS umzurechnen (Gesamtstunden geteilt durch
            15)
        </p>
        <div
            v-for="(course, index) in modelCourses"
            :key="index"
            class="course-entry mb-4 flex flex-wrap items-center gap-4"
        >
            <FloatLabel variant="on">
                <InputText v-model="course.name" />
                <label>Name der Veranstaltung</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputNumber
                    v-model="course.sws"
                    :min="0"
                    :step="1"
                    :min-fraction-digits="2"
                    :max-fraction-digits="2"
                    showButtons
                />
                <label>Umfang (SWS)*</label>
            </FloatLabel>
            <div class="flex items-center">
                <label for="course.ordered" class="mr-2"> Angeordnet? </label>
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
                <div class="flex flex-col gap-4 p-2">
                    <Textarea v-model="course.comment" rows="8" />
                    <Button
                        label="Speichern"
                        class="p-button-success"
                        icon="pi pi-save"
                        @click="(course.showComment = false)"
                    />
                </div>
            </Drawer>
        </div>
        <div class="mb-4">
            <p class="font-semibold">Summe (SWS): {{ sum.toFixed(2) }}</p>
        </div>
        <Button
            label="Lehrveranstaltung hinzufügen"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="addCourse"
        />
    </div>
</template>
