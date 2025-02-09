<script setup lang="ts">
/**
 * @file DiscountsSection.vue
 * @description Komponente für den Bereich „Ermäßigungen“.
 *              Hier können Ermäßigungen hinzugefügt, bearbeitet und entfernt werden.
 *              Es wird ein Select-Feld für den Ermäßigungstyp, Eingaben für Beschreibung, SWS,
 *              Genehmigungsdatum und -person sowie ein Checkbox-Feld für „Angeordnet?“ angezeigt.
 */

import { defineProps, defineEmits, computed } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Checkbox from 'primevue/checkbox'
import Drawer from 'primevue/drawer'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

/**
 * Interface für eine Ermäßigung.
 */
interface Reduction {
    type: number
    details: string
    approvedBy: string
    approvedOn: Date
    sws: number
    comment: string
    showComment: boolean
    ordered: boolean
}

/**
 * Interface für einen Ermäßigungstyp.
 */
interface ReductionType {
    label: string
    value: number
}

// Props: v-model binding für reductions, Optionsliste und die berechnete Summe
const props = defineProps<{
    reductions: Reduction[]
    reductionTypes: ReductionType[]
    sum: number
}>()

const emits = defineEmits<{
    (e: 'update:reductions', value: Reduction[]): void
}>()

// Computed Property für das Zwei-Wege-Binding (v-model)
const modelReductions = computed({
    get: () => props.reductions,
    set: (val: Reduction[]) => emits('update:reductions', val),
})

/**
 * Fügt einen neuen, leeren Eintrag zur Liste der Ermäßigungen hinzu.
 */
function addReduction() {
    modelReductions.value.push({
        type: 0,
        details: '',
        approvedBy: '',
        approvedOn: new Date(),
        sws: 0,
        comment: '',
        showComment: false,
        ordered: false,
    })
}

/**
 * Entfernt einen Ermäßigungs-Eintrag an der angegebenen Position.
 * @param index Index des zu entfernenden Eintrags
 */
function removeReduction(index: number) {
    modelReductions.value.splice(index, 1)
}
</script>

<template>
    <div class="card discounts">
        <h2 class="mb-4 text-xl font-semibold">Ermäßigungen</h2>
        <div
            v-for="(reduction, index) in modelReductions"
            :key="index"
            class="reduction-entry mb-8 flex flex-wrap gap-4"
        >
            <div class="flex w-full flex-col md:w-2/3">
                <div class="mb-4 flex flex-wrap gap-4">
                    <FloatLabel variant="on">
                        <Select
                            v-model="reduction.type"
                            :options="reductionTypes"
                            option-label="label"
                            option-value="value"
                            style="width: 200px"
                        />
                        <label>Art der Ermäßigung</label>
                    </FloatLabel>
                    <FloatLabel variant="on">
                        <InputText v-model="reduction.details" />
                        <label>Beschreibung</label>
                    </FloatLabel>
                    <FloatLabel variant="on">
                        <InputNumber
                            v-model="reduction.sws"
                            :min="0"
                            :step="0.1"
                            :min-fraction-digits="2"
                            :max-fraction-digits="2"
                            showButtons
                        />
                        <label>Umfang (SWS)</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-wrap items-center gap-4">
                    <FloatLabel variant="on">
                        <DatePicker
                            v-model="reduction.approvedOn"
                            date-format="dd.mm.yy"
                            placeholder="Datum auswählen"
                        />
                        <label>Genehmigt am</label>
                    </FloatLabel>
                    <FloatLabel variant="on">
                        <InputText v-model="reduction.approvedBy" />
                        <label>Genehmigt durch</label>
                    </FloatLabel>
                    <div class="flex items-center">
                        <label class="mr-2">Angeordnet?</label>
                        <Checkbox v-model="reduction.ordered" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-between">
                <Button
                    label="Entfernen"
                    icon="pi pi-trash"
                    class="p-button-danger"
                    @click="removeReduction(index)"
                />
                <Button
                    label="Kommentar hinzufügen"
                    icon="pi pi-comments"
                    class="p-button-secondary mt-4"
                    @click="(reduction.showComment = true)"
                />
            </div>
            <Drawer
                v-model:visible="reduction.showComment"
                header="Kommentar zur Ermäßigung"
                position="right"
            >
                <div class="flex flex-col gap-4 p-2">
                    <Textarea v-model="reduction.comment" rows="8" />
                    <Button
                        label="Speichern"
                        class="p-button-success"
                        icon="pi pi-save"
                        @click="(reduction.showComment = false)"
                    />
                </div>
            </Drawer>
        </div>
        <div class="mb-4">
            <p class="font-semibold">Summe (SWS): {{ sum.toFixed(2) }}</p>
        </div>
        <Button
            label="Ermäßigung hinzufügen"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="addReduction"
        />
    </div>
</template>
