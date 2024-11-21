<script setup>
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  isShow: {
    type: Boolean,
    default: true
  },
  tooltipClass: {
    type: String,
    default: ''
  }
})
const isShow = ref(props.isShow)

watch(() => props.isShow, (value) => {
  isShow.value = value
})
</script>

<template>
  <div
    v-if="isShow"
    class="absolute z-10 p-2 -bottom-8 left-1/2 transform -translate-x-1/2
            bg-gray-800 text-white text-xs rounded-lg
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            pointer-events-none"
    :class="tooltipClass"
  >
    {{ text }}
  </div>
</template>

<style scoped></style>
