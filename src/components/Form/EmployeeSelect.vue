<template>
  <q-select
    v-model="textValue"
    use-input
    input-debounce="0"
    label="Especialista"
    dense
    :option-label="
      (employee) =>
        employee
          ? [employee.first_name, employee.last_name].join(' ')
          : 'Seleccione un especialista'
    "
    :options="employeeSelectOptions"
    emit-value
    map-options
    option-value="id"
    clearable
    @filter="selectFilterFn"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          Especialista no encontrado
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  options: Object,
});

const emit = defineEmits(['update:modelValue']);
const employeeSelectOptions = ref(null);

const textValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

onMounted(() => (employeeSelectOptions.value = props.options));

const selectFilterFn = (val, update) => {
  if (val === '') {
    update(() => {
      employeeSelectOptions.value = props.options;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    employeeSelectOptions.value = props.options.filter(
      (v) =>
        v.first_name.toLowerCase().indexOf(needle) > -1 ||
        (v.last_name && v.last_name.toLowerCase().indexOf(needle) > -1)
    );
  });
};
</script>
