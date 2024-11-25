<template>
  <main class="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-6">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
      <h1 class="text-3xl font-bold mb-4">Full screen</h1>
      <div>{{ result }}</div>

      <div class="mt-6 flex items-center justify-center space-x-2">
        <span class="text-sm">Powered By Vite</span>
        <pixelarticons-zap class="inline-block text-xl" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { ref, onMounted } from 'vue'

const result = ref('')

onMounted(() => {
  useLocalStorage('result', result)
})
</script>
