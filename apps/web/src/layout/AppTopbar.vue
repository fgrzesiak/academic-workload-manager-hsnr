<script setup lang="ts">
import { useLayout } from './composables/layout'
import UserPopover from '@/components/UserPopover.vue'

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout()
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button
                class="layout-menu-button layout-topbar-action"
                @click="onMenuToggle"
            >
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="/logo3.png" alt="Logo" class="h-10" />

                <span>Deputatsverwaltung FB08</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button
                    type="button"
                    class="layout-topbar-action"
                    @click="toggleDarkMode"
                >
                    <i
                        :class="[
                            'pi',
                            { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme },
                        ]"
                    ></i>
                    <!-- <i v-if="!isDarkTheme" class="pi pi-exclamation-triangle" style="margin-left: 8px; color: orange;"></i> -->
                </button>
            </div>

            <button
                v-styleclass="{
                    selector: '@next',
                    enterFromClass: 'hidden',
                    enterActiveClass: 'animate-scalein',
                    leaveToClass: 'hidden',
                    leaveActiveClass: 'animate-fadeout',
                    hideOnOutsideClick: true,
                }"
                class="layout-topbar-menu-button layout-topbar-action"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <user-popover />
                </div>
            </div>
        </div>
    </div>
</template>
