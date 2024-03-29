<template>
  <q-input v-model="textValue" dense stack-label type="time" lazy-rules />
</template>

<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
  modelValue: [String, Number],
});

const emit = defineEmits(['update:modelValue']);

const textValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
