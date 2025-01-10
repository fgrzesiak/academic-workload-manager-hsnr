<script setup lang="ts">

</script>
<template>
    <div class="card">
        <div class="flex justify-between mb-4">
            <h1 class="mb-4 text-xl font-semibold">Übersicht der Lehrveranstaltungen</h1>
            <Button
                label="Neue Lehrveranstaltung"
                icon="pi pi-plus"
                class="mr-2"
                @click="openNew"
            />
        </div>

        <DataTable
            :value="deputats"
            :paginator="true"
            :rows="10"
            size="small"
            data-key="id"
            :row-hover="true"
            :loading="loading"
            v-model:filters="filters"
            :global-filter-fields="['name']"
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
            <template #empty>Keine Lehrveranstaltungen gefunden.</template>

            <!-- ID Column -->
            <Column field="id" header="ID" style="min-width: 1rem" sortable>
                <template #body="{ data }">{{ data.id }}</template>
            </Column>

            <!-- Name Column -->
            <Column
                field="name"
                header="Name"
                style="min-width: 10rem"
            >
                <template #body="{ data }">{{ data.name }}</template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
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

            <!-- Hours Column -->
            <Column
                field="hours"
                header="SWS"
                style="min-width: 6rem"
            >
                <template #body="{ data }">{{ formatNumber(data.hours) }}</template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" fluid style="max-width: 6rem" :step="0.1" :min="0" />
                </template>
            </Column>

            <!-- ProgramId Column -->

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
                style="width: 10%; min-width: 8rem"
                bodyStyle="text-align:center"
            ></Column>

            <Column
            style="width: 4rem; text-align: center"
            :headerStyle="{ textAlign: 'center' }"
            >
                <template #body="{ data }">
                    <Button
                        v-if="data.commentId > 0"
                        icon="pi pi-comments"
                        class="p-button-secondary"
                        @click="showComment(data.commentId)"
                    />
                </template>
            </Column>

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
    </div>
</template>