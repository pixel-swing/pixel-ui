<script setup>
import { defineAsyncComponent, h } from 'vue'
const props = defineProps({
  icon: {
    type: String,
    default: 'box',
  },
  width: {
    type: [Number, String],
    default: 18,
  },
  height: {
    type: [Number, String],
    default: 18,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
})
const SvgPath = props.icon ? defineAsyncComponent(() => import(`../packages/icons/fa/vue/${props.icon}.vue`)) : null
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="icon"
    role="presentation"
  >
    <title :id="icon" lang="en">{{ icon }} icon</title>
    <g :fill="color">
      <SvgPath />
    </g>
  </svg>
</template>
