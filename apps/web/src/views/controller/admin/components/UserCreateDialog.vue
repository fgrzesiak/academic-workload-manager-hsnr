<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'
import { useToast } from 'primevue'
import UserService from '@/service/user.service'
import { ICreateUserRequest, IUserResponse, UserRole } from '@workspace/shared'
import { getFormStatesAsType } from '@/helpers/functions'

// Import PrimeVue-Komponenten
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Message from 'primevue/message'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'

// Props und Events
interface SelectOption {
    label: string
    value: number
}
const props = defineProps<{
    visible: boolean
    groupSelect: SelectOption[]
}>()
const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'user-created', newUser: IUserResponse): void
}>()

// Proxy für das v-model der Sichtbarkeit
const visibleProxy = computed({
    get: () => props.visible,
    set: (value) => emits('update:visible', value),
})

const toast = useToast()

// Zustandsvariablen für den Dialog und die Tabsteuerung
const newUserSubmitted = ref(false)
const activeTab = ref(0) // 0 = Lehrer, 1 = Controller

// Zod-Schema für Lehrer
const teacherSchema = z.object({
    username: z.string().trim().min(5).max(30),
    password: z.string().trim().min(6).max(30),
    isPasswordTemporary: z.boolean(),
    firstName: z.string().trim().min(1).max(30),
    lastName: z.string().trim().min(1).max(30),
    'relation.retirementDate': z.date(),
    'relation.totalTeachingDuty': z.number(),
    'relation.teachingGroupId': z
        .number()
        .refine((value) => props.groupSelect.some((s) => s.value === value), {
            message: 'Ungültige Lehrgruppe',
        }),
    role: z.literal(UserRole.TEACHER),
})

// Zod-Schema für Controller
const controllerSchema = z.object({
    username: z.string().trim().min(5).max(30),
    password: z.string().trim().min(6).max(30),
    isPasswordTemporary: z.boolean(),
    firstName: z.string().trim().min(1).max(30),
    lastName: z.string().trim().min(1).max(30),
    role: z.literal(UserRole.CONTROLLER),
})

// Resolver für die Formulare
const resolverTeacher = ref(zodResolver(teacherSchema))
const resolverController = ref(zodResolver(controllerSchema))

/**
 * Gibt die initialen Werte für das neue Nutzerformular zurück,
 * basierend auf dem aktuell aktiven Tab (Lehrer oder Controller).
 */
const getNewUserValues = () => {
    return activeTab.value === 0
        ? {
              username: '',
              password: Math.random().toString(36).slice(-8),
              firstName: '',
              lastName: '',
              'relation.retirementDate': new Date(
                  new Date().setFullYear(new Date().getFullYear() + 10)
              ),
              'relation.totalTeachingDuty': 0,
              'relation.teachingGroupId': 0,
              role: UserRole.TEACHER,
              isPasswordTemporary: true,
          }
        : {
              username: '',
              password: Math.random().toString(36).slice(-8),
              firstName: '',
              lastName: '',
              role: UserRole.CONTROLLER,
              isPasswordTemporary: true,
          }
}

/**
 * Schließt den Dialog und setzt den Formularstatus zurück.
 */
const hideDialog = () => {
    emits('update:visible', false)
    newUserSubmitted.value = false
}

/**
 * Handler für die Formularübermittlung zur Erstellung eines neuen Nutzers.
 * Führt den API-Call durch und informiert bei Erfolg die Elternkomponente.
 * @param event Das FormSubmitEvent des PrimeVue-Formulars
 */
const onCreateUserFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newUserSubmitted.value = true
        const newUser = getFormStatesAsType<ICreateUserRequest>(states)
        if (newUser.relation) {
            newUser.relation.totalTeachingDuty = 0
        }
        const res = await UserService.createUser(newUser)
        if (res.error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: res.error,
                life: 5000,
            })
        } else {
            emits('user-created', res.data)
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Nutzer erstellt',
                life: 3000,
            })
        }
        hideDialog()
    }
}

/**
 * Beobachtet Änderungen an der Sichtbarkeit und setzt den aktiven Tab zurück,
 * wenn der Dialog geöffnet wird.
 */
watch(
    () => props.visible,
    (newVal) => {
        if (newVal) {
            activeTab.value = 0
            // Aktualisiere die Resolver (falls erforderlich)
            resolverTeacher.value = zodResolver(teacherSchema)
            resolverController.value = zodResolver(controllerSchema)
        }
    }
)
</script>

<template>
    <Dialog
        v-model:visible="visibleProxy"
        :style="{ width: '500px' }"
        header="Neuer Nutzer"
        :modal="true"
        @hide="hideDialog"
    >
        <Tabs v-model:value="activeTab">
            <TabList>
                <Tab :value="0">Lehrende/-r</Tab>
                <Tab :value="1">Controller</Tab>
            </TabList>

            <TabPanels>
                <!-- Formular für Lehrer -->
                <TabPanel v-if="activeTab === 0" :value="0">
                    <Form
                        v-slot="$form"
                        :resolver="resolverTeacher"
                        :initial-values="getNewUserValues()"
                        class="flex w-full flex-col gap-4"
                        @submit="onCreateUserFormSubmit"
                    >
                        <!-- Nutzername -->
                        <div class="mt-2 flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <InputText
                                    id="username"
                                    name="username"
                                    fluid
                                />
                                <label
                                    for="username"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Nutzername
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->
                            <Message
                                v-if="$form.username?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.username.error?.message }}
                            </Message>
                        </div>

                        <!-- Passwort -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <Password
                                    id="password"
                                    name="password"
                                    fluid
                                    toggle-mask
                                    :feedback="false"
                                />
                                <label
                                    for="password"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Initiales Passwort
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="$form.password?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.password.error?.message }}
                            </Message>
                        </div>

                        <!-- Vorname -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <InputText
                                    id="firstName"
                                    name="firstName"
                                    fluid
                                />
                                <label
                                    for="firstName"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Vorname
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="$form.firstName?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.firstName.error?.message }}
                            </Message>
                        </div>

                        <!-- Nachname -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <InputText
                                    id="lastName"
                                    name="lastName"
                                    fluid
                                />
                                <label
                                    for="lastName"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Nachname
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="$form.lastName?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.lastName.error?.message }}
                            </Message>
                        </div>

                        <!-- Ruhestandsdatum -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <DatePicker
                                    id="relation.retirementDate"
                                    name="relation.retirementDate"
                                    date-format="dd.mm.yy"
                                    fluid
                                />
                                <label
                                    for="relation.retirementDate"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Ruhestandsdatum
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="
                                    $form['relation.retirementDate']?.error
                                        ?.invalid
                                "
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{
                                    $form['relation.retirementDate'].error
                                        ?.message
                                }}
                            </Message>
                        </div>

                        <!-- Lehrgruppe -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <Select
                                    label-id="relation.teachingGroupId"
                                    name="relation.teachingGroupId"
                                    :options="groupSelect"
                                    option-label="label"
                                    option-value="value"
                                    fluid
                                />
                                <label
                                    for="relation.teachingGroupId"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Lehrgruppe
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->
                            <Message
                                v-if="
                                    $form['relation.teachingGroupId']?.error
                                        ?.invalid
                                "
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{
                                    $form['relation.teachingGroupId'].error
                                        ?.message
                                }}
                            </Message>
                        </div>

                        <!-- Verstecktes Feld für Rolle -->
                        <InputText type="hidden" id="role" name="role" />

                        <!-- Buttons -->
                        <div class="flex flex-row gap-2">
                            <Button
                                label="Abbrechen"
                                icon="pi pi-times"
                                text
                                @click="hideDialog"
                            />
                            <Button
                                type="submit"
                                label="Erstellen"
                                icon="pi pi-check"
                            />
                        </div>
                    </Form>
                </TabPanel>

                <!-- Formular für Controller -->
                <TabPanel v-if="activeTab === 1" :value="1">
                    <Form
                        v-slot="$form"
                        :resolver="resolverController"
                        :initial-values="getNewUserValues()"
                        class="flex w-full flex-col gap-4"
                        @submit="onCreateUserFormSubmit"
                    >
                        <!-- Nutzername -->
                        <div class="mt-2 flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <InputText
                                    id="username"
                                    name="username"
                                    fluid
                                />
                                <label
                                    for="username"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Nutzername
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="$form.username?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.username.error?.message }}
                            </Message>
                        </div>

                        <!-- Passwort -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <Password
                                    id="password"
                                    name="password"
                                    fluid
                                    toggle-mask
                                    :feedback="false"
                                />
                                <label
                                    for="password"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Initiales Passwort
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="$form.password?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.password.error?.message }}
                            </Message>
                        </div>

                        <!-- Vorname -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <InputText
                                    id="firstName"
                                    name="firstName"
                                    fluid
                                />
                                <label
                                    for="firstName"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Vorname
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="$form.firstName?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.firstName.error?.message }}
                            </Message>
                        </div>

                        <!-- Nachname -->
                        <div class="flex flex-col gap-1">
                            <FloatLabel variant="on">
                                <InputText
                                    id="lastName"
                                    name="lastName"
                                    fluid
                                />
                                <label
                                    for="lastName"
                                    class="mb-2 block text-lg font-medium"
                                >
                                    Nachname
                                </label>
                            </FloatLabel>
                            <!-- @vue-expect-error -->

                            <Message
                                v-if="$form.lastName?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                            >
                                <!-- @vue-expect-error -->

                                {{ $form.lastName.error?.message }}
                            </Message>
                        </div>

                        <!-- Verstecktes Feld für Rolle -->
                        <InputText type="hidden" id="role" name="role" />

                        <!-- Buttons -->
                        <div class="flex flex-row gap-2">
                            <Button
                                label="Abbrechen"
                                icon="pi pi-times"
                                text
                                @click="hideDialog"
                            />
                            <Button
                                type="submit"
                                label="Erstellen"
                                icon="pi pi-check"
                            />
                        </div>
                    </Form>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Dialog>
</template>
