<script setup lang="ts">
const welcomeMsg = () => {
    const v = 'v1.0.16';
    console.log(`\n%cDPT-Manager  ${v} 🚀`, 'color:#0dd8d8; background:#0b1021; font-size:1.5rem; padding:0.15rem 0.25rem; margin: 1rem auto; font-family: Rockwell; border: 2px solid #0dd8d8; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;');
};
welcomeMsg();
</script>

<template>
    <toast />
    <router-view />
</template>

<style scoped></style>
