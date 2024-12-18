<template>
    <div class="card">
        <h1 class="text-xl font-semibold">Stammdatenverwaltung</h1>
    </div>
    <div class="card">
        <h2 class="mb-4 text-l font-semibold">Semester</h2>
        <p>Semester anlegen und bearbeiten (aktives Semester für Datenübertragung setzen/ als abgeschlossen markieren)</p>
        <table style="border-collapse: collapse; width: 100%; border: 2px solid #333;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">SemesterID</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Name</th>
                    <th style="border: 2px solid #333; padding: 8px; text-align: center;">Aktiv?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">4</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Sommer 2024</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Ja</td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">3</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Winter 2023/2024</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Sommer 2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                </tr>
                <tr>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Winter 2022/2023</td>
                    <td style="border: 2px solid #333; padding: 8px; text-align: center;">Nein</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="grid grid-cols-7 gap-4 ">
        <div class="card mb-0 col-span-4">
            <h2 class="mb-4 text-l font-semibold">Betreuungsarten + Anrechnungsfaktor</h2>
            <table style="border-collapse: collapse; width: 100%; border: 2px solid #333;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">ID</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Art der Betreuung</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Multiplikationsfaktor</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Gültig ab</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Bachelor</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS24</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Master</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS24</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">3</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Zweitprüfer</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,1</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS20</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">4</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Praxissemester</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">0,2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">SS20</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card col-span-3">
            <h2 class="mb-4 text-l font-semibold">Ermäßigungsarten</h2>
            <table style="border-collapse: collapse; width: 100%; border: 2px solid #333;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">ID</th>
                        <th style="border: 2px solid #333; padding: 8px; text-align: center;">Art der Ermäßigung</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">1</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Funktion/Aufgabe</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">2</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Forschung/Entwicklung</td>
                    </tr>
                    <tr>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">3</td>
                        <td style="border: 2px solid #333; padding: 8px; text-align: center;">Gesetzlich</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup lang="ts"></script>