<template>
  <q-select
    v-model="textValue"
    :options="[
      {
        label: 'Balneario Thermas de Griñon',
        value: 1,
      },
      {
        label: 'JOSÉ LUIS LÓPEZ SIMÓN',
        value: 2,
      },
    ]"
    emit-value
    map-options
    dense
    class="q-mb-md"
    lazy-rules
  >
  </q-select>
</template>

<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const textValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
