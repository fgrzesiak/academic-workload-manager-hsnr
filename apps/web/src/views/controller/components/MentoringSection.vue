<script setup lang="ts">
/**
 * @file MentoringSection.vue
 * @description Komponente für den Bereich „Betreuungen“.
 *              Hier können Betreuungen hinzugefügt, bearbeitet und entfernt werden.
 *              Es werden Typen (z. B. Betreuungstypen) über ein Select-Feld gewählt.
 *              Zudem wird die Summe der SWS der Betreuungen berechnet und ein Warnhinweis angezeigt,
 *              falls das Maximum überschritten wird.
 */

import { defineProps, defineEmits, computed } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Textarea from 'primevue/textarea'

/**
 * Interface für eine Betreuung (Mentoring).
 */
interface Mentoring {
    type: number
    matriculationNumber: number
    comment: string
    showComment: boolean
    supervisionShare: number
}

/**
 * Interface für einen Betreuungstyp mit Berechnungsfaktor.
 */
interface MentoringType {
    label: string
    value: number
    calculation: number
}

// Props: v-model binding für mentoring, Optionsliste für Betreuungstypen, berechnete Summe und max. SWS
const props = defineProps<{
    mentoring: Mentoring[]
    mentoringTypes: MentoringType[]
    sum: number
    maxSupervisions: number
}>()

const emits = defineEmits<{
    (e: 'update:mentoring', value: Mentoring[]): void
}>()

// Computed Property für das Zwei-Wege-Binding (v-model)
const modelMentoring = computed({
    get: () => props.mentoring,
    set: (val: Mentoring[]) => emits('update:mentoring', val),
})

/**
 * Fügt einen neuen leeren Betreuungseintrag hinzu.
 */
function addMentoring() {
    modelMentoring.value.push({
        type: 0,
        matriculationNumber: 0,
        comment: '',
        showComment: false,
        supervisionShare: 0,
    })
}

/**
 * Entfernt einen Betreuungseintrag an der angegebenen Position.
 * @param index Index des zu entfernenden Eintrags
 */
function removeMentoring(index: number) {
    modelMentoring.value.splice(index, 1)
}
</script>

<template>
    <div class="card mentoring">
        <h2 class="mb-4 text-xl font-semibold">Betreuungen</h2>
        <div
            v-for="(mentor, index) in modelMentoring"
            :key="index"
            class="mentoring-entry mb-4 flex flex-wrap gap-4"
        >
            <FloatLabel variant="on">
                <Select
                    v-model="mentor.type"
                    :options="mentoringTypes"
                    option-label="label"
                    option-value="value"
                    style="width: 200px"
                />
                <label>Art der Betreuung</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputNumber
                    v-model="mentor.matriculationNumber"
                    :min="0"
                    :min-fraction-digits="0"
                    :max-fraction-digits="0"
                    :useGrouping="false"
                    :step="1"
                />
                <label>Matrikelnummer</label>
            </FloatLabel>
            <!-- Beispiel: Falls ein bestimmter Betreuungstyp (z. B. mit value === 4) gewählt wurde,
           wird ein zusätzliches Eingabefeld für den Betreuungsanteil angezeigt. -->
            <FloatLabel variant="on" v-if="mentor.type === 4">
                <InputNumber
                    v-model="mentor.supervisionShare"
                    :min="0"
                    :max="100"
                    :step="1"
                    :min-fraction-digits="2"
                    :max-fraction-digits="2"
                    showButtons
                />
                <label>Betreuungsanteil (in %)</label>
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
                <div class="flex flex-col gap-4 p-2">
                    <Textarea v-model="mentor.comment" rows="8" />
                    <Button
                        label="Speichern"
                        class="p-button-success"
                        icon="pi pi-save"
                        @click="(mentor.showComment = false)"
                    />
                </div>
            </Drawer>
        </div>
        <div class="mb-4">
            <p class="font-semibold">Summe (SWS): {{ sum.toFixed(3) }}</p>
            <p v-if="sum > maxSupervisions" class="font-bold text-red-500">
                Die maximal anrechenbaren SWS wurden überschritten! (gemäß
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
</template>
