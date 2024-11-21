<script setup>
const props = defineProps({
  iconPath: {
    type: String,
    required: true,
  },
  viewBox: {
    type: String,
    default: '0 0 24 24',
  },
  isShow: {
    type: Boolean,
    default: true,
  },
  iconClass: {
    type: String,
    default: '',
  },
});
const isShow = ref(props.isShow);

watch(() => props.isShow, (value) => {
  isShow.value = value;
});
</script>

<template>
  <svg
    v-if="isShow"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :viewBox="viewBox"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      :d="iconPath"
    />
  </svg>
</template>

<style scoped></style>
