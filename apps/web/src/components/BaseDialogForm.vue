<script setup lang="ts">
/**
 * @file BaseDialogForm.vue
 * @description Generische Dialog-Komponente, die ein Formular kapselt.
 *              Unterstützt v-model:visible über einen computed Getter/Setter.
 */

import { computed, defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog'

const props = defineProps<{
    visible: boolean
    title: string
    width?: string
}>()

const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void
}>()

// Computed Property für v-model:visible
const modelVisible = computed({
    get: () => props.visible,
    set: (value: boolean) => emits('update:visible', value),
})
</script>

<template>
    <Dialog
        v-model:visible="modelVisible"
        :style="{ width: width || '450px' }"
        :header="title"
        :modal="true"
    >
        <!-- Slot für den Formularinhalt -->
        <slot name="form"></slot>
    </Dialog>
</template>
