<script setup lang="ts">

// Utility to format dates
function formatDate(value: Date) {
    return value.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}
</script>

<template>
    <div class="card">
        <h1 class="mb-4 text-xl font-semibold">Übersicht der eingereichten Ermäßigungen</h1>
        <Toolbar class="mb-6">
            <template #start>
                <Button
                    label="Neue Ermäßigung"
                    icon="pi pi-plus"
                    class="mr-2"
                    @click=""
                />
            </template>
        </Toolbar>
        <table style="border-collapse: collapse; width: 100%; border: 2px solid #333;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">ID</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Ermäßigungsart</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Angeordnet?</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Genehmigungsdatum</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Genehmigt von</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Infos</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Semester</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Lehrperson</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Bearbeiten</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Forschung/Entwicklung</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Ja</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">15.05.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Smith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Research Project Alpha</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Sommer 22/23</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">jdoe</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Gesetzlich</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">01.06.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Brown</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Family Support</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Winter 24</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">asmith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Forschung/Entwicklung</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Ja</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">15.05.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Smith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Research Project Alpha</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Sommer 22/23</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">jdoe</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Gesetzlich</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">01.06.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Brown</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Family Support</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Winter 24</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">asmith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Forschung/Entwicklung</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Ja</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">15.05.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Smith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Research Project Alpha</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Sommer 22/23</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">jdoe</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Gesetzlich</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">01.06.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Brown</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Family Support</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Winter 24</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">asmith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Forschung/Entwicklung</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Ja</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">15.05.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Smith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Research Project Alpha</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Sommer 22/23</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">jdoe</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Gesetzlich</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">01.06.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Brown</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Family Support</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Winter 24</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">asmith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Forschung/Entwicklung</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Ja</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">15.05.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Smith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Research Project Alpha</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Sommer 22/23</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">jdoe</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Gesetzlich</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">01.06.2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Dr. Brown</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Family Support</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Winter 24</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">asmith</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;"><i class="pi pi-palette text-blue-500"></i></td>
                </tr>
            </tbody>
        </table>

    </div>
</template>