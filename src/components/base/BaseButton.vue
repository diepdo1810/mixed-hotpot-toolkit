<script setup>
defineProps({
  buttonClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    @click="handleClick"
    :class="buttonClass"
  >
    <slot />
  </button>
</template>

<style scoped></style>
