<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { onBeforeMount, ref } from 'vue'
import DiscountService from '@/service/discount.service'
import { IDiscountResponse, ICreateDiscountRequest } from '@workspace/shared'
import DiscountTypeService from '@/service/discountType.service'
import SemesterService from '@/service/semester.service'
import TeacherService from '@/service/teacher.service'
import { IDiscountTypeResponse, ISemesterResponse, ITeacherResponse } from '@workspace/shared'
import {
    DataTableFilterMeta,
    DataTableRowEditSaveEvent,
    useToast,
} from 'primevue'
import { getFormStatesAsType } from '@/helpers/functions'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form, FormSubmitEvent } from '@primevue/forms'

interface SelectOption {
    label: string;
    value: number;
}

const booleanOptions = ref([
    { label: 'Ja', value: true },
    { label: 'Nein', value: false },
]);

const discounts = ref<IDiscountResponse[]>([])
const filters = ref<DataTableFilterMeta>({})
const editingRows = ref([])
const loading = ref(false)
const toast = useToast()
const typeSelect = ref<SelectOption[]>([])
const semesterSelect = ref<SelectOption[]>([])
const userSelect = ref<SelectOption[]>([])

const updateDiscounts = (data: IDiscountResponse[]) => {
    discounts.value = data.map((d) => { 
        return d 
    })
}

/**
 * New Discount Configuration
 */
const newDiscountSubmitted = ref(false)
const newDiscountDialog = ref(false)
const newDiscountSchema = z.object({
    discountTypeId: z.number(),
    semesterPeriodId: z.number(),
    teacherId: z.number(),
    ordered: z.boolean(),
    approvalDate: z.date(),
    supervisor: z.string().trim().min(5).max(255),
    commentId: z.number(),
    description: z.string().trim().min(5).max(255),
    scope: z.number(),
})
const resolver = ref(zodResolver(newDiscountSchema))

const openNew = () => {
    newDiscountSubmitted.value = false
    newDiscountDialog.value = true
}

const hideDialog = () => {
    newDiscountDialog.value = false
    newDiscountSubmitted.value = false
}

const deleteEntry = (id: number) => {
    discounts.value = discounts.value.filter(event => event.id !== id);
    toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Betreuung erfolgreich gelöscht',
        life: 3000,
    })
}

const getNewDiscountValues = (): z.infer<typeof newDiscountSchema> => {
    return {
        discountTypeId: 0,
        semesterPeriodId: 0,
        teacherId: 0,
        ordered: false,
        approvalDate: new Date(),
        supervisor: '',
        commentId: 0,
        description: '',
        scope: 0,
    } satisfies ICreateDiscountRequest
}

const onCreateDiscountFormSubmit = async ({ valid, states }: FormSubmitEvent) => {
    if (valid) {
        newDiscountSubmitted.value = true
        const newDiscount = getFormStatesAsType<ICreateDiscountRequest>(states)
        // newDiscount.programId = null
        DiscountService.createDiscount(newDiscount).then((res) => {
            const { data, error } = res
            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Fehler',
                    detail: error,
                    life: 5000,
                })
            } else {
                updateDiscounts([...discounts.value, data])
                toast.add({
                    severity: 'success',
                    summary: 'Erfolgreich',
                    detail: 'Ermäßigung erstellt',
                    life: 3000,
                })
            }
        })

        newDiscountDialog.value = false
    }
}

const onRowEditSave = ({ newData }: DataTableRowEditSaveEvent) => {
    DiscountService.updateDiscount(newData).then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            data
            updateDiscounts(discounts.value.map((u) => (u.id === data.id ? data : u)))
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich',
                detail: 'Ermäßigung aktualisiert',
                life: 3000,
            })
        }
    })
}

onBeforeMount(() => {
    loading.value = true
    DiscountService.getDiscounts().then((res) => {
        const { data, error } = res
        if (error) {
            toast.add({
                severity: 'error',
                summary: 'Fehler',
                detail: error,
                life: 5000,
            })
        } else {
            updateDiscounts(data)
        }
    })

    DiscountTypeService.getDiscountTypes().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Discount-Overview] Couldn`t load discountTypes")
        } else {
            typeSelect.value = data.map((discountType: IDiscountTypeResponse) => ({
                label: discountType.discountType,
                value: discountType.discountTypeId,
            }));
        }
    })

    SemesterService.getSemesters().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Discount-Overview] Couldn`t load semster")
        } else {
            semesterSelect.value = data.map((semester: ISemesterResponse) => ({
                label: semester.name,
                value: semester.id,
            }));
        }
    })

    TeacherService.getTeachers().then((res) => {
        const { data, error } = res
        if (error) {
            console.warn("[Discount-Overview] Couldn`t load teachers")
        } else {
            userSelect.value = data.map((teacher: ITeacherResponse) => ({
                label: teacher.firstName + " " + teacher.lastName,
                value: teacher.id,
            }));
        }
    })

    initFilters()
    loading.value = false
})

// Initialize filters
function initFilters() {
    filters.value = {
        global: { 
            value: null, 
            matchMode: FilterMatchMode.CONTAINS ,
        },
        description: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
        supervisor: {
            value: null,
            matchMode: FilterMatchMode.STARTS_WITH,
        },
    }
}

//convert semester ID into Name
const getSemesterName = (id: number) => {
    const semester = semesterSelect.value.find((s) => s.value === id);
    return semester ? semester.label : 'Unbekannt';
};

const getUserName = (id: number) => {
    const user = userSelect.value.find((s) => s.value === id);
    return user ? user.label : 'Unbekannt';
};

const getTypeName = (id: number) => {
    const type = typeSelect.value.find((s) => s.value === id);
    return type ? type.label : 'Unbekannt';
};

const formatBoolean = (value: boolean) => (value ? 'Ja' : 'Nein');

const formatDate = (value: string) => {
    if (!value) return '';
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
</script>

<template>
    <div class="card">
        <div class="flex justify-between mb-4">
            <h1 class="mb-4 text-xl font-semibold">Übersicht der Ermäßigungen</h1>
            <Button
                label="Neue Ermäßigung"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNew"
            />
        </div>

        <DataTable
            :value="discounts"
            :paginator="true"
            :rows="10"
            data-key="id"
            :row-hover="true"
            filter-display="row"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="['description', 'supervisor']"
            v-model:editing-rows="editingRows"
            editMode="row"
            @row-edit-save="onRowEditSave"
            :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }: any) => ({
                        style:
                            state['d_editing'] &&
                            'padding-top: 0.75rem; padding-bottom: 0.75rem',
                    }),
                },
            }"
        >
            <!-- Table Header -->
            <template #header>
                <div class="flex justify-between">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Filter aufheben"
                        outlined
                        @click="initFilters"
                    />
                    <div class="flex items-center gap-2">
                        <i class="pi pi-search" />
                        <!-- @vue-ignore -->
                        <InputText
                            v-model="filters['global'].value"
                            placeholder="Suche"
                        />
                    </div>
                </div>
            </template>

            <!-- Empty Table State -->
            <template #empty>Keine Ermäßigung gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- DiscountType Column -->
            <Column
                field="discountTypeId"
                header="Art der Betreuung"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ getTypeName(data.discountTypeId) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="typeSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- Description Column -->
            <Column
                field="description"
                header="Beschreibung"
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.description }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Ermäßigung suchen"
                    />
                </template>
            </Column>

            <!-- Supervisor Column -->
            <Column
                field="supervisor"
                header="Genehmigt durch"
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.supervisor }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        @input="filterCallback()"
                        v-model="filterModel.value"
                        type="text"
                        placeholder="Vorgesetzten suchen"
                    />
                </template>
            </Column>

            <!-- ApprovalDate Column -->
            <Column
                header="Genehmigungsdatum"
                filter-field="date"
                data-type="date"
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ formatDate(data.approvalDate) }}</template>
                <template #editor="{ data, field }">
                    <DatePicker v-model="data[field]" date-format="dd.mm.yy" placeholder="Genehmigungsdatum auswählen" fluid />
                </template>
            </Column>

            <!-- Semester Column -->
            <Column
                field="semesterPeriodId"
                header="Semester"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ getSemesterName(data.semesterPeriodId) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="semesterSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- Scope Column -->
            <Column
                field="scope"
                header="Umfang (SWS)"
                style="min-width: 6rem"
            >
                <template #body="{ data }">{{ data.scope }}</template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" fluid :min="0" />
                </template>
            </Column>

            <!-- Teacher Column -->
            <Column
                field="teacherId"
                header="Lehrperson"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ getUserName(data.teacherId) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="userSelect" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <!-- Ordered Column -->
            <Column
                field="ordered"
                header="Angeordnet?"
                style="min-width: 8rem"
            >
                <template #body="{ data }">{{ formatBoolean(data.ordered) }}</template>
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="booleanOptions" option-label="label" option-value="value" fluid />
                </template>
            </Column>

            <Column
                :rowEditor="true"
                style="width: 10%; min-width: 2rem;"
                bodyStyle="text-align:center"
            ></Column>

            <Column
            style="width: 4rem; text-align: center"
            :headerStyle="{ textAlign: 'center' }"
            >
                <template #body="{ data }">
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-danger"
                        @click="deleteEntry(data.id)"
                    />
                </template>
            </Column>

        </DataTable>

        <Dialog
            v-model:visible="newDiscountDialog"
            :style="{ width: '450px' }"
            header="Neue Betreuung"
            :modal="true"
        >
            <!-- Form inside the dialog -->
            <Form
                v-slot="$form"
                :resolver
                :initial-values="getNewDiscountValues()"
                class="flex w-full flex-col gap-4"
                @submit="onCreateDiscountFormSubmit"
            >

                <!-- DiscountType Field -->
                <div class="flex flex-col gap-1 mt-2">
                    <FloatLabel variant="on">
                        <Select
                            label-id="discountTypeId"
                            name="discountTypeId"
                            :options="typeSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="discountTypeId"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Art der Ermäßigung</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.discountTypeId?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.discountTypeId.error?.message }}
                    </Message>
                </div>
                
                <!-- Description Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="description" name="description" fluid />
                        <label
                            for="description"
                            class="block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Beschreibung der Ermäßigung</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.description?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.description.error?.message }}
                    </Message>
                </div>

                <!-- Suervisor Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputText id="supervisor" name="supervisor" fluid />
                        <label
                            for="supervisor"
                            class="block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Genehmigt durch</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.supervisor?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.supervisor.error?.message }}
                    </Message>
                </div>

                <!-- ApprovalDate Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <DatePicker id="approvalDate" name="approvalDate" date-format="dd.mm.yy" placeholder="Datum auswählen" fluid/>
                        <label
                            for="approvalDate"
                            class="block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Genehmigungsdatum</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.approvalDate?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.approvalDate.error?.message }}
                    </Message>
                </div>

                <!-- Semester Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="semesterPeriodId"
                            name="semesterPeriodId"
                            :options="semesterSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="semesterPeriodId"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Semester</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.semesterPeriodId?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.semesterPeriodId.error?.message }}
                    </Message>
                </div>

                <!-- Scope Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <InputNumber id="scope" name="scope" :min="0" fluid />
                        <label
                            for="scope"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Umfang (SWS)</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.scope?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.scope.error?.message }}
                    </Message>
                </div>

                <!-- Teacher Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="teacherId"
                            name="teacherId"
                            :options="userSelect"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="teacherId"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Lehrperson</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.teacherId?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.teacherId.error?.message }}
                    </Message>
                </div>

                <!-- Ordered Field -->
                <div class="flex flex-col gap-1">
                    <FloatLabel variant="on">
                        <Select
                            label-id="ordered"
                            name="ordered"
                            :options="booleanOptions"
                            option-label="label"
                            option-value="value"
                            fluid
                        ></Select>
                        <label
                            for="ordered"
                            class="mb-2 block text-lg font-medium text-surface-900 dark:text-surface-0"
                            >Angeordnet?</label
                        >
                    </FloatLabel>
                    <!-- @vue-expect-error -->
                    <Message
                        v-if="$form.ordered?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        <!-- @vue-expect-error -->
                        {{ $form.ordered.error?.message }}
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