<template>
  <q-input v-model="textValue" dense stack-label type="date" lazy-rules />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const textValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
