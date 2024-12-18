<template>
    <div class="card">
        <h1 class="mb-4 text-xl font-semibold">Stammdatenverwaltung</h1>
    </div>
    <div class="card">
        <h2 class="mb-4 text-l font-semibold">Semester</h2>
        <p>Semester anlegen und bearbeiten (aktives Semester für Datenübertragung setzen/ als abgeschlossen markieren)</p>
    </div>
    <div class="grid grid-cols-2 gap-4 ">
        <div class="card col-span-1">
            <h2 class="mb-4 text-l font-semibold">Betreuungsarten + Anrechnungsfaktor</h2>
            <p>Nebeneinander Tabellen mit SupervisionType und DiscountType</p>
        </div>
        <div class="card col-span-1">
            <h2 class="mb-4 text-l font-semibold">Ermäßigungsarten</h2>
        </div>
    </div>
</template>
<script setup lang="ts"></script>
