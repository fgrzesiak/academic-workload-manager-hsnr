<script setup lang="ts">
import { ref } from 'vue'

const isUpsideDown = ref(false)

const welcomeMsg = () => {
    const v = 'v1.0.16'
    console.log(
        `\n%cDPT-Manager  ${v} 🚀`,
        'color:#0dd8d8; background:#0b1021; font-size:1.5rem; padding:0.15rem 0.25rem; margin: 1rem auto; font-family: Rockwell; border: 2px solid #0dd8d8; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;'
    )
}
welcomeMsg()

const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
]
let konamiIndex = 0

const handleKeydown = (event: KeyboardEvent) => {
    if (event.code === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
            isUpsideDown.value = !isUpsideDown.value
            konamiIndex = 0
        }
    } else {
        konamiIndex = 0
    }
}

window.addEventListener('keydown', handleKeydown)
</script>

<template>
    <div
        :style="{
            transform: isUpsideDown ? 'rotate(180deg)' : 'none',
            transition: 'transform 1.25s ease-in-out',
        }"
    >
        <toast />
        <router-view />
    </div>
</template>

<style scoped></style>
