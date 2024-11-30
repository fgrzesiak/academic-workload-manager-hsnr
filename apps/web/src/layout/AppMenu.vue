<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

import AppMenuItem, { MenuItem } from './AppMenuItem.vue'
import { CONTROLLER_MENU, TEACHER_MENU } from './composables/menu-config'
const { role } = useAuthStore()

const getMenu = () => {
    if (role === 'CONTROLLER') {
        return CONTROLLER_MENU
    } else if (role === 'TEACHER') {
        return TEACHER_MENU
    }
    return []
}
const model = ref<MenuItem[]>(getMenu())
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item
                v-if="!item.separator"
                :item="item"
                :index="i"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
