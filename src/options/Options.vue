<template>
  <main class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-6">
    <div
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl w-full text-center transition-transform duration-300 ease-in-out transform hover:scale-105">
      <h1 class="text-4xl font-bold mb-6 animate-fade-in">Full screen</h1>

      <div class="text-gray-700 dark:text-gray-200 text-left leading-relaxed space-y-4 animate-slide-up" v-html="convertedHtml"></div>

      <div class="mt-8 flex items-center justify-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">Powered By Vite</span>
        <pixelarticons-zap class="inline-block text-xl text-yellow-500 dark:text-yellow-400 animate-bounce" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { ref, onMounted } from 'vue'
import { marked } from 'marked';

const result = ref('')
const convertedHtml = ref('')

onMounted(() => {
  const storeValue = useLocalStorage('result', result);
  result.value = storeValue.value || '';
  convertedHtml.value = <string>marked(result.value);
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 1.2s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}
</style>
