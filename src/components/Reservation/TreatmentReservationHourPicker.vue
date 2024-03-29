<template>
  <q-input
    v-model="hourValue"
    type="time"
    stack-label
    dense
    label="Hora (HH:mm)"
    :rules="[(val) => InputValidationService.required(val)]"
  />
</template>

<script setup>
import InputValidationService from 'src/services/InputValidationService';
import { computed } from '@vue/reactivity';
import { watch } from 'vue';
import { useTreatmentReservationStore } from 'src/stores/treatmentReservation';
import { useEmployeeTimeOffStore } from 'src/stores/employeeTimeOff';
import { storeToRefs } from 'pinia';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';

const props = defineProps({
  modelValue: [String, Number],
  date: String,
  employeeId: Number,
  duration: [String, Number],
  reservationId: Number,
});
const emit = defineEmits(['update:modelValue', 'update:save']);

const { fetchTreatmentReservationsByEmployee } = useTreatmentReservationStore();
const { fetchEmployeesTimeOff } = useEmployeeTimeOffStore();
const { treatmentReservationsByEmployee } = storeToRefs(
  useTreatmentReservationStore()
);
const { employeesTimeOff } = storeToRefs(useEmployeeTimeOffStore());
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();

const hourValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

watch(props, () => {
  if (!props.duration || !props.employeeId) {
    return false;
  }

  fetchEmployeesTimeOff({
    employee_id: props.employeeId,
    from_date_from: props.date + ' 00:00:00',
    from_date_to: props.date + ' 23:59:59',
  }).then(() => {
    const completeDay = employeesTimeOff.value.find(
      (item) => item.type === 'Día Completo'
    );
    if (completeDay) {
      notifyError('Horario no disponible');
      emit('update:save', false);
      return false;
    }
    const newReservationStart = Date.parse(props.date + ' ' + hourValue.value);
    let availableTime = true;

    for (const employeeTimeOff of employeesTimeOff.value) {
      const existTimeOffStart = Date.parse(employeeTimeOff.from_date);
      const existTimeOffEnd = Date.parse(employeeTimeOff.to_date);
      if (
        newReservationStart < existTimeOffEnd &&
        existTimeOffStart <= newReservationStart
      ) {
        availableTime = false;
        break;
      }
    }

    if (!availableTime) {
      notifyError('Horario no disponible');
      emit('update:save', false);
      return false;
    }

    fetchTreatmentReservationsByEmployee(props.employeeId, props.date).then(
      () => {
        availableTime = true;
        const newReservationEnd = new Date(
          newReservationStart + props.duration * 60000
        );

        for (const reservation of treatmentReservationsByEmployee.value) {
          if (props.reservationId === reservation.id) {
            continue;
          }

          const existReservationStart = Date.parse(
            reservation.date + ' ' + reservation.time
          );
          const existReservationEnd = new Date(
            existReservationStart + reservation.duration * 60000
          );

          if (
            newReservationStart < existReservationEnd &&
            existReservationStart < newReservationEnd
          ) {
            availableTime = false;
            break;
          }
        }

        if (availableTime) {
          notifySuccess('Horario disponible');
          emit('update:save', true);
        } else {
          notifyError('Horario no disponible');
          emit('update:save', false);
        }
      }
    );
  });
});
</script>
