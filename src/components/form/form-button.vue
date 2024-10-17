<script setup>
const props = defineProps({
  text: String,
  isDisabled: Boolean,
  events: String
})
const emit = defineEmits()

const handleClick = () => {
  emit(props.events)
}
</script>

<template>
  <button
    @click="handleClick"
    type="button"
    class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
  >
    <slot name="icon"></slot>
    <span class="sr-only">{{ text }}</span>
  </button>
</template>
