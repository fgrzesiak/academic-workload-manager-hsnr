<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import EvaluationSettingsService from '@/service/evaluationSettings.service'
import { IEvaluationSettingsResponse, ICreateEvaluationSettingsRequest, } from '@workspace/shared'
import { 
    DataTableRowEditSaveEvent,
    useToast,
} from 'primevue'
import { getFormStatesAsType } from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

// define reactive variables
const settings = ref<IEvaluationSettingsResponse[]>([])
const loading = ref(false)
const editingRows = ref([])
const toast = useToast()

// definition of selection options for dataTypes
const typeSelect = ref([
    { label: 'Ganze Zahl', value: "int" },
    { label: 'Komma Zahl', value: "float" },
    { label: 'Text', value: "string" },
    { label: 'Wahrheitswert', value: "bool" },
]);

// variables and schema for creating a new setting
const newSettingSubmitted = ref(false)
const newSettingDialog = ref(false)
const newSettingSchema = z.object({
    key: z.string().trim().min(10).max(255),
    value: z.string().trim().min(1).max(255),
    dataType: z.string().trim().min(3).max(20),
})
const resolver = ref(zodResolver(newSettingSchema))


// updates the list within the tabular display of the settings with new data
const updateSettings = (data: IEvaluationSettingsResponse[]) => {
    settings.value = data.map((d) => { 
        return d 
    })
}

//opens the dialog for adding a new setting
const openNew = () => {
    newSettingSubmitted.value = false
    newSettingDialog.value = true
}

// closes the dialog of the setting creation without action
const hideDialog = () => {
    newSettingDialog.value = false
    newSettingSubmitted.value = false
}

// Initializes the values for a new setting
const getNewSettingValues = (): z.infer<typeof newSettingSchema> => {
    return {
        key: '',
        value: '',
        dataType: '',
    } satisfies ICreateEvaluationSettingsRequest
}

// submit handler for the form for creating a new setting
const onCreateSettingFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newSettingSubmitted.value = true
        const newSetting = getFormStatesAsType<ICreateEvaluationSettingsRequest>(states)
        EvaluationSettingsService.createEvaluationSettings(newSetting).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                updateSettings([...settings.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Einstellung erstellt',
                    life: 3000,
                })
            }
        })

        newSettingDialog.value = false
    }
}

// function to load data from service
const loadData = () => {
    loading.value = true;
    EvaluationSettingsService.getEvaluationSettings().then((res) => {
        const { data, error } = res;
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Laden der Einstellungen',
                detail: error,
                life: 5000,
            });
        } else {
            settings.value = data.map((setting: IEvaluationSettingsResponse) => setting);
        }
    });

    loading.value = false;
};

// load data before mounting the component
onBeforeMount(loadData);

// saves changes to a course
const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    EvaluationSettingsService.updateEvaluationSettings(newData).then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateSettings(settings.value.map((u) => (u.id === data.id ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Einstellung aktualisiert',
                life: 3000,
            })
        }
    })
}

// converts type IDs to names
const getDataTypeName = (value: string) => {
    const type = typeSelect.value.find((s) => s.value === value);
    return type ? type.label : 'Unbekannt';
}

const getSetting = (key: string) => {
    const setting = settings.value.find((s) => s.key === key)
    return setting ? setting.value : '"Unbekannt"';
}

</script>

<template>
    <div class="grid grid-cols-12 gap-8 mb-4">
        <div class="col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0">
                <div class="mb-4 flex justify-between">
                    <div>
                        <span class="mb-4 block font-medium text-muted-color"
                            >Zu berücksichtigende Semester</span
                        >
                        <div
                            class="mb-4 text-xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            {{ getSetting("saldation_period") }}
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-center bg-orange-100 rounded-border dark:bg-orange-400/10"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i
                            class="pi pi-clock !text-xl text-orange-500"
                        ></i>
                    </div>
                </div>
                <span class="text-xs text-muted-color">*Die Anzahl der Semester, die nach dem ersten aktiven Semester rückwirkend für die Erstellung des Saldos berücksichtigt werden sollen.</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0">
                <div class="mb-4 flex justify-between">
                    <div>
                        <span class="mb-4 block font-medium text-muted-color"
                            >Obergrenze des Deputats (Multiplikationsfaktor)</span
                        >
                        <div
                            class="mb-4 text-xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            {{ getSetting("factor_upper_limit") }}
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-center bg-cyan-100 rounded-border dark:bg-cyan-400/10"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-fast-forward !text-xl text-cyan-500"></i>
                    </div>
                </div>
                <span class="text-xs text-muted-color">*Der Multiplikationsfaktor, um den das zu erreichende Saldo pro Semester das tatsächlich zu erreichende individuelle Deputat nicht überschreiten darf.</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-4">
            <div class="card mb-0">
                <div class="mb-4 flex justify-between">
                    <div>
                        <span class="mb-4 block font-medium text-muted-color"
                            >Untergrenze des Deputats (Multiplikationsfaktor)</span
                        >
                        <div
                            class="mb-4 text-xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            {{ getSetting("factor_lower_limit") }}
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-center bg-cyan-100 rounded-border dark:bg-cyan-400/10"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-fast-backward !text-xl text-cyan-500"></i>
                    </div>
                </div>
                <span class="text-xs text-muted-color">*Der Multiplikationsfaktor, um den das zu erreichende Saldo pro Semester das tatsächlich zu erreichende individuelle Deputat nicht unterschreiten darf.</span>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="flex justify-between mb-4">
            <h1 class="mb-4 text-xl font-semibold">Übersicht der Saldierungs-Einstellungen</h1>
            <Button
                label="Neue Einstellung"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNew"
            />
        </div>
        
        <!-- table to display the data -->
        <DataTable
            :value="settings"
            size="small"
            data-key="id"
            showGridlines
            scrollable
            editMode="row"
            v-model:editing-rows="editingRows"
            @row-edit-save="onRowEditSave"
        >
            <!-- Empty Table State -->
            <template #empty>Keine Daten gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Name Column -->
            <Column
                field="key"
                header="Name"
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.key }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>

            <!-- Value Column -->
            <Column
                field="value"
                header="Wert"
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.value }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>

            <!-- DataType Column -->
            <Column
                field="dataType"
                header="Datentyp"
                style="min-width: 10rem"
                sortable
            >
                <template #body="{ data }">{{ getDataTypeName(data.dataType) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="typeSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- edit data -->
            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>
        </DataTable>

        <!-- add new course -->
        <Dialog
            v-model:visible="newSettingDialog"
            :style="{ width: '450px' }"
            header="Neue Saldierungs-Einstellung"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolver
                :initial-values="getNewSettingValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateSettingFormSubmit"
            >
                <!-- Name Field -->
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="key" name="key" fluid />
                        <label
                            for="key"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Name der Einstellung</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.key?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.key.error?.message }}
                    </Message>
                </div>

                <!-- Value Field -->
                <div class="mt-2 flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="value" name="value" fluid />
                        <label
                            for="value"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Wert der Einstellung</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.value?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.value.error?.message }}
                    </Message>
                </div>

                <!-- DataType Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="dataType"
                            name="dataType"
                            :options="typeSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="dataType"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Datentyp</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.dataType?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.dataType.error?.message }}
                    </Message>
                </div>

                <!-- Footer -->
                <div class="flex flex-row">
                    <Button
                        label="Abbrechen"
                        icon="pi pi-times"
                        text
                        @click="hideDialog"
                        fluid
                    />
                    <Button
                        type="submit"
                        icon="pi pi-check"
                        label="Erstellen"
                        fluid
                    />
                </div>
            </Form>
        </Dialog>
    </div>
</template>
