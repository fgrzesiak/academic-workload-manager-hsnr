<script setup lang="ts">
import { Popover } from 'primevue'
import { useAuthStore } from '@/stores/auth.store'

import { ref, VNodeRef } from 'vue'

const userPopover = ref<VNodeRef | null>(null)

const toggle = (event: MouseEvent) => {
    userPopover.value.toggle(event)
}

const logout = () => {
    useAuthStore().logout()
}
</script>

<template>
    <div>
        <button type="button" class="layout-topbar-action" @click="toggle">
            <i class="pi pi-user"></i>
            <span>Profile</span>
        </button>
        <Popover ref="userPopover">
            <div class="p-shadow-4 w-52">
                <Button
                    @click="logout"
                    type="submit"
                    severity="danger"
                    label="Abmelden"
                    class="w-full"
                />
            </div>
        </Popover>
    </div>
</template>
