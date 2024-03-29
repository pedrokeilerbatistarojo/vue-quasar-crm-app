<template>
  <q-select v-model="dateValue" dense :options="options" label="Hora" />
</template>

<script setup>
import { DateTime } from 'luxon';
import { useClosedHourStore } from 'src/stores/closedHour';
import { storeToRefs } from 'pinia';
import { onBeforeMount, computed, watch, ref } from 'vue';
import CircuitReservationService from 'src/services/CircuitReservationService';

const props = defineProps({
  modelValue: [String, Number],
  date: String
});

const emit = defineEmits(['update:modelValue']);

const { closedHours } = storeToRefs(useClosedHourStore());
const { fetchClosedHours } = useClosedHourStore();
const options = ref([]);

const dateValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const dateEntered = computed(() => props.date);

onBeforeMount(() => {
  if (props.date) {
    fillOptions(props.date);
  }
});

watch(dateEntered, () => fillOptions(dateEntered.value));

const fillOptions = (date) => {
  fetchClosedHours({ date_from: date, date_to: date }).then(() => {
      const timeSlots = CircuitReservationService.getTimeSlots(
        DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('dd/MM/yyyy')
      );

      if (closedHours.value.length === 0) {
        options.value = timeSlots.flatMap((item) =>
          item.deferred_entry ? [item.start, item.deferred_entry] : item.start
        );
        return;
      }

    const currentClosedHours = closedHours.value[0].closed_hours;

    options.value = timeSlots
      .filter((item) => !currentClosedHours.includes(item.start))
      .flatMap((item) =>
        item.deferred_entry ? [item.start, item.deferred_entry] : item.start
      );
  });
};
</script>
