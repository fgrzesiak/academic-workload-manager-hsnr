<script setup lang="ts">
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
//import { useAuthStore } from '@/stores/';
import { useToast } from 'primevue';
import { FormSubmitEvent } from '@primevue/forms';
import AuthService from '@/service/auth.service';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const toast = useToast();
const { login, logout } = useAuthStore();

interface FormValues {
    username?: string;
    password?: string;
}

const initialValues: FormValues = {
    username: '',
    password: ''
};

const isFetching = ref(false);

const resolver = ({ values }: { values: FormValues }) => {
    const errors: { username?: { message: string }[]; password?: { message: string }[] } = {};

    if (!values.username) {
        errors.username = [{ message: 'Benutzername ist erforderlich.' }];
    }
    if (!values.password) {
        errors.password = [{ message: 'Passwort ist erforderlich.' }];
    }

    return {
        errors
    };
};

const onFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        const username = states.username.value;
        const password = states.password.value;

        isFetching.value = true;

        const { data, error } = await AuthService.login({ username, password });
        isFetching.value = false;

        if (error.value || !data.value) {
            toast.add({ severity: 'error', summary: 'Fehler', detail: error.value, life: 5000 });
            logout();
        } else if (!data.value || !data.value.token) {
            toast.add({ severity: 'error', summary: 'Fehler', detail: 'Ein unbekannter Fehler ist aufgetreten.', life: 5000 });
            logout();
        } else {
            toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Login erfolgreich!' });
            login({ token: data.value.token });
        }
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/logo.png" alt="Logo" class="h-24 w-auto mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Deputatsverwaltung FB08</div>
                        <span class="text-muted-color font-medium">Anmelden um fortzufahren</span>
                    </div>
                    <div class="flex w-full">
                        <Toast />

                        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="on">
                                    <label for="username" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2">Benutzername</label>
                                    <InputText name="username" class="w-full" type="text" fluid />
                                </FloatLabel>
                                <!-- @vue-expect-error: https://github.com/primefaces/primevue/issues/6723 -->
                                <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
                                    <!-- @vue-expect-error -->
                                    {{ $form.username.error?.message }}
                                </Message>
                            </div>
                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="on">
                                    <Password name="password" :toggleMask="true" fluid :feedback="false" />
                                    <label for="password" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2">Passwort</label>
                                </FloatLabel>
                                <!-- @vue-expect-error: https://github.com/primefaces/primevue/issues/6723 -->
                                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                                    <!-- @vue-expect-error -->
                                    {{ $form.password.error?.message }}
                                </Message>
                            </div>
                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <Checkbox id="rememberme" binary class="mr-2"></Checkbox>
                                    <label for="rememberme">Angemeldet bleiben</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Passwort vergessen?</span>
                            </div>
                            <Button :loading="isFetching" type="submit" label="Anmelden" class="w-full" />
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
