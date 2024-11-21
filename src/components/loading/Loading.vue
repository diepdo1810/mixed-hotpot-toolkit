<script setup>
import { ref } from 'vue'
const props = defineProps({
  isLoaded: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '',
  }
})

const isLoaded = ref(props.isLoaded)

watch(() => props.isLoaded, (value) => {
  isLoaded.value = value
})
</script>

<template>
  <div v-if="isLoaded" class="mt-3 flex justify-center items-center">
    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
    <span class="ml-2 text-gray-600 text-sm">{{ text }}</span>
  </div>
</template>
