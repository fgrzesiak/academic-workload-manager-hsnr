<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useToast } from 'primevue'
import UserService from '@/service/user.service'
import TeachingGroupService from '@/service/teachingGroup.service'
import { IUserResponse, ITeachingGroupResponse } from '@workspace/shared'

// Import der unterteilten Komponenten
import UserTable from './components/UserTable.vue'
import UserCreateDialog from './components/UserCreateDialog.vue'

/**
 * Typdefinition für Dropdown-Optionen (z. B. für Lehrgruppen)
 */
interface SelectOption {
    label: string
    value: number
}

// Zustände der Hauptkomponente
const users = ref<IUserResponse[]>([])
const loading = ref(false)
const groupSelect = ref<SelectOption[]>([])
const showCreateDialog = ref(false)

const toast = useToast()

/**
 * Aktualisiert die interne Nutzerliste und konvertiert Datumsstrings in Date-Objekte.
 * Wichtig für die korrekte Anzeige in der Tabelle und für den DatePicker.
 * @param data Liste der Nutzer
 */
const updateUsers = (data: IUserResponse[]) => {
    users.value = data.map((d) => {
        if (d.Teacher) {
            // Setze Zeit auf 00:00 Uhr für die korrekte Filterung (DatePicker)
            d.Teacher.retirementDate = new Date(
                new Date(d.Teacher.retirementDate).setHours(0, 0, 0, 0)
            )
        }
        d.createdAt = new Date(d.createdAt)
        d.updatedAt = new Date(d.updatedAt)
        return d
    })
}

/**
 * Lädt beim Mounten der Komponente die Nutzer und Lehrgruppen aus dem Backend.
 */
onBeforeMount(async () => {
    loading.value = true

    // Laden der Nutzer
    const resUsers = await UserService.getUsers()
    if (resUsers.error) {
        toast.add({
            severity: 'error',
            summary: 'Fehler',
            detail: resUsers.error,
            life: 5000,
        })
    } else {
        updateUsers(resUsers.data)
    }

    // Laden der Lehrgruppen
    const resGroups = await TeachingGroupService.getTeachingGroups()
    if (resGroups.error) {
        console.warn('[Users] Lehrgruppen konnten nicht geladen werden.')
    } else {
        groupSelect.value = resGroups.data.map(
            (group: ITeachingGroupResponse) => ({
                label: group.groupName,
                value: group.id,
            })
        )
    }

    loading.value = false
})

/**
 * Öffnet den Dialog zur Erstellung eines neuen Nutzers.
 */
const openCreateDialog = () => {
    showCreateDialog.value = true
}

/**
 * Handler, der ausgeführt wird, wenn ein neuer Nutzer erstellt wurde.
 * @param newUser Der neu erstellte Nutzer
 */
const handleUserCreated = (newUser: IUserResponse) => {
    updateUsers([...users.value, newUser])
}

/**
 * Handler, der ausgeführt wird, wenn ein Nutzer in der Tabelle aktualisiert wurde.
 * @param updatedUser Der aktualisierte Nutzer
 */
const handleUserUpdated = (updatedUser: IUserResponse) => {
    users.value = users.value.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
    )
    toast.add({
        severity: 'success',
        summary: 'Erfolgreich',
        detail: 'Nutzer aktualisiert',
        life: 3000,
    })
}
</script>

<template>
    <div class="card">
        <!-- Kopfbereich mit Titel und Button zum Erstellen eines neuen Nutzers -->
        <div class="mb-4 flex justify-between">
            <h1 class="mb-4 text-xl font-semibold">Nutzerverwaltung</h1>
            <Button
                label="Neuer Nutzer"
                icon="pi pi-plus"
                class="mr-2"
                @click="openCreateDialog"
            />
        </div>
        <!-- Tabelle mit der Nutzerliste -->
        <UserTable
            :users="users"
            :groupSelect="groupSelect"
            @user-updated="handleUserUpdated"
        />

        <!-- Dialog zur Neuerstellung eines Nutzers -->
        <UserCreateDialog
            v-model:visible="showCreateDialog"
            :groupSelect="groupSelect"
            @user-created="handleUserCreated"
        />
    </div>
</template>
