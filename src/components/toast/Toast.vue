<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  isShow: {
    type: Boolean,
    default: false
  },
  isSuccess: {
    type: Boolean,
    default: false
  }
})

const isShow = ref(props.isShow)

watch(() => props.isShow, (value) => {
  isShow.value = value
})
</script>

<template>
  <Transition
    name="toast"
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-300"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="isShow"
      class="fixed bottom-4 right-4 z-50"
    >
      <div
        :class="isSuccess ? 'bg-blue-500' : 'bg-red-500'"
        class="text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="font-medium">{{ text }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped></style>