<template>
  <q-input
    v-model="dateValue"
    dense
    :rules="[(v) => InputValidationService.isHumanReadableFormat(v)]"
  >
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            v-model="dateValue"
            mask="DD/MM/YYYY"
            :options="checkAvailability"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Aceptar" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { DateTime } from 'luxon';
import { storeToRefs } from 'pinia';
import InputValidationService from 'src/services/InputValidationService';
import { useClosedHourStore } from 'src/stores/closedHour';
import { onBeforeMount, ref } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
});

const emit = defineEmits(['update:modelValue']);

const { closedHours } = storeToRefs(useClosedHourStore());
const { fetchClosedHours } = useClosedHourStore();

const disabledDatesForCalendar = ref([]);

const dateValue = computed({
  get: () =>
    DateTime.fromFormat(props.modelValue, 'yyyy-MM-dd').toFormat('dd/MM/yyyy'),
  set: (value) =>
    emit(
      'update:modelValue',
      DateTime.fromFormat(value, 'dd/MM/yyyy').toFormat('yyyy-MM-dd')
    ),
});

onBeforeMount(() =>
  fetchClosedHours().then(() => {
    disabledDatesForCalendar.value = closedHours.value
      .filter((item) => item.type === 'Día Completo')
      .map((item) =>
        DateTime.fromFormat(item.date, 'yyyy-MM-dd').toFormat('yyyy/MM/dd')
      );
  })
);

const checkAvailability = (date) =>
  !disabledDatesForCalendar.value.includes(date);
</script>
