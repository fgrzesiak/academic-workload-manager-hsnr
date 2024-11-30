<script setup lang="ts">
import FloatingConfigurator from '@/components/FloatingConfigurator.vue'
</script>

<template>
    <FloatingConfigurator />
    <div class="flex min-h-screen items-center justify-center overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="
                    border-radius: 56px;
                    padding: 0.3rem;
                    background: linear-gradient(
                        180deg,
                        color-mix(
                                in srgb,
                                var(--primary-color),
                                transparent 60%
                            )
                            10%,
                        var(--surface-ground) 30%
                    );
                "
            >
                <div
                    class="flex w-full flex-col items-center bg-surface-0 px-8 py-20 sm:px-20 dark:bg-surface-900"
                    style="border-radius: 53px"
                >
                    <img src="/logo3.png" alt="Logo" class="mb-5 h-24 w-auto" />
                    <span class="text-3xl font-bold text-primary">404</span>
                    <h1
                        class="mb-2 text-3xl font-bold text-surface-900 lg:text-5xl dark:text-surface-0"
                    >
                        Nicht gefunden
                    </h1>
                    <div class="mb-8 text-surface-600 dark:text-surface-200">
                        Die angeforderte Seite wurde nicht gefunden.
                    </div>

                    <Button
                        as="router-link"
                        label="Zurück zur Startseite"
                        to="/"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
