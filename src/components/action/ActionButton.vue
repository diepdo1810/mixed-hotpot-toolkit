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
  tooltipText: {
    type: String,
    default: '',
  },
  buttonClass: {
    type: String,
    default: '',
  },
  iconClass: {
    type: String,
    default: 'w-5 h-5 mx-auto text-gray-800',
  },
  tooltipClass: {
    type: String,
    default: '',
  },
  isShowIcon: {
    type: Boolean,
    default: true,
  },
  isShowTooltip: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div class="relative group">
    <!-- Use BaseButton and listen for click event -->
    <BaseButton
      :buttonClass="buttonClass"
      class="group transition-all duration-300 transform hover:scale-105 hover:shadow p-2 rounded-lg text-center"
      @click="handleClick"
    >
      <!-- Insert icon inside button -->
      <Icon
        v-if="isShowIcon"
        :iconPath="iconPath"
        :viewBox="viewBox"
        :class="iconClass"
      />
    </BaseButton>

    <!-- Show Tooltip on hover -->
    <TooltipText
      v-if="isShowTooltip"
      :text="tooltipText"
      :tooltipClass="tooltipClass"
    />
  </div>
</template>

<style scoped></style>
