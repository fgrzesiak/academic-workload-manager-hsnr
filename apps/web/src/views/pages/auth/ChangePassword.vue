<script setup lang="ts">
import FloatingConfigurator from '@/components/FloatingConfigurator.vue'
import { useToast } from 'primevue'
import { FormSubmitEvent } from '@primevue/forms'
import UserService from '@/service/user.service'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAlertStore } from '@/stores/alert.store'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'

const toast = useToast()
const { logout, isPasswordTemporary } = useAuthStore()
const { show } = useAlertStore()

const isFetching = ref(false)

const resolver = ref(
    zodResolver(
        z
            .object({
                password: z.string().min(1, 'Passwort ist erforderlich.'),
                confirmPassword: z
                    .string()
                    .min(1, 'Bitte Passwort wiederholen.'),
            })
            .refine((data) => data.password === data.confirmPassword, {
                message: 'Die Passwörter stimmen nicht überein.',
                path: ['confirmPassword'],
            })
    )
)

const onFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        const password = states.password.value
        isFetching.value = true
        const { error } = await UserService.changePassword({ password })
        isFetching.value = false
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            logout()
            show({
                summary: 'Erfolg',
                detail: 'Passwort erfolgreich geändert. Bitte melden Sie sich erneut an.',
                life: 5000,
            })
        }
    }
}
</script>

<template>
    <FloatingConfigurator />
    <div
        class="flex min-h-screen min-w-[100vw] items-center justify-center overflow-hidden bg-surface-50 dark:bg-surface-950"
    >
        <div class="flex flex-col items-center justify-center">
            <div
                style="
                    border-radius: 56px;
                    padding: 0.3rem;
                    background: linear-gradient(
                        180deg,
                        var(--primary-color) 10%,
                        rgba(33, 150, 243, 0) 30%
                    );
                "
            >
                <div
                    class="w-full bg-surface-0 px-8 py-20 sm:px-20 dark:bg-surface-900"
                    style="border-radius: 53px"
                >
                    <div class="mb-8 text-center">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            class="mx-auto h-24 w-auto"
                        />
                        <div
                            class="mb-4 text-3xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            Deputatsverwaltung FB08
                        </div>
                        <span class="font-medium text-muted-color">
                            {{
                                isPasswordTemporary
                                    ? 'Initialpasswort ändern'
                                    : 'Passwort ändern'
                            }}
                        </span>
                    </div>
                    <div class="flex w-full">
                        <Toast />

                        <Form
                            v-slot="$form"
                            :resolver
                            class="flex w-full flex-col gap-4"
                            @submit="onFormSubmit"
                        >
                            <!-- Password Field -->
                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="on">
                                    <Password
                                        name="password"
                                        :toggle-mask="true"
                                        fluid
                                    />
                                    <label
                                        for="password"
                                        class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                        >Neues Passwort</label
                                    >
                                </FloatLabel>
                                <!-- @vue-expect-error: https://github.com/primefaces/primevue/issues/6723 -->
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

                            <!-- Confirm Password Field -->
                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="on">
                                    <Password
                                        name="confirmPassword"
                                        :toggle-mask="true"
                                        :feedback="false"
                                        fluid
                                    />
                                    <label
                                        for="confirmPassword"
                                        class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                                        >Passwort wiederholen</label
                                    >
                                </FloatLabel>
                                <!-- @vue-expect-error: https://github.com/primefaces/primevue/issues/6723 -->
                                <Message
                                    v-if="$form.confirmPassword?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    <!-- @vue-expect-error -->
                                    {{ $form.confirmPassword.error?.message }}
                                </Message>
                            </div>

                            <Button
                                :loading="isFetching"
                                type="submit"
                                class="w-full"
                                label="Passwort ändern"
                            />
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
