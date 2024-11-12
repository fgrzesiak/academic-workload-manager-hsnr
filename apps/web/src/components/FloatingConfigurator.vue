<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'

const { toggleDarkMode, isDarkTheme } = useLayout()
</script>

<template>
    <div class="fixed right-8 top-8 flex gap-4">
        <Button
            type="button"
            rounded
            :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'"
            severity="secondary"
            @click="toggleDarkMode"
        />
    </div>
</template>
