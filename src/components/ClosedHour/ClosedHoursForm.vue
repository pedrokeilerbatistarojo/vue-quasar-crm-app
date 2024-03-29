<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <span class="text-grey-7"
      >Seleccione una fecha para gestionar su disponibilidad.</span
    >
    <div class="row q-col-gutter-sm align-end">
      <div class="col-12 col-md-4 col-lg-3">
        <q-input v-model="form.date" dense stack-label type="date" />
      </div>
      <div v-if="form.date" class="col-12 col-md-4 col-lg-3">
        <q-toggle
          v-model="form.open_date"
          label="Día abierto"
          color="dark-blue"
        />
      </div>
    </div>

    <div v-if="form.open_date && hoursSlots">
      <h6 class="q-mb-md">Horas habilitadas</h6>
      <div class="row q-col-gutter-lg">
        <div v-for="hoursSlot of form.hours_status" :key="hoursSlot.start">
          <q-toggle
            v-model="hoursSlot.available"
            :label="hoursSlot.start"
            color="dark-blue"
          />
        </div>
      </div>
    </div>
    <div v-if="form.date" class="row q-mt-lg">
      <div class="col-12">
        <q-input v-model="form.description" type="textarea" label="Notas" />
      </div>
    </div>
    <div v-if="form.date" class="q-mt-lg">
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
      />
    </div>
  </q-form>
</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import { onMounted, reactive, ref, watch } from 'vue';
import { useClosedHourStore } from 'stores/closedHour.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import TextInput from '../Form/TextInput.vue';
import CircuitReservationService from 'src/services/CircuitReservationService';
import { DateTime } from 'luxon';

const props = defineProps({
  closedHourId: Number,
});
const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { closedHours, error, loading, validationsErrors } = storeToRefs(
  useClosedHourStore()
);
const { editClosedHour, storeClosedHour, fetchClosedHours } =
  useClosedHourStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);

const form = reactive({
  id: props.closedHour?.id,
  date: props.closedHour?.name,
  type: props.closedHour?.type,
  description: props.closedHour?.description,
  open_date: null,
  closed_hours: [],
  hours_status: [],
});

const hoursSlots = ref(null);

onMounted(() => {
  if (props.closedHour) {
    isEditing.value = true;
  }
});

const onSubmit = () => {
  if (form.open_date) {
    form.type = 'Horas';
    form.closed_hours = form.hours_status
      .filter((item) => !item.available)
      .map((item) => item.start);
  } else {
    form.type = 'Día Completo';
    form.closed_hours = [];
  }

  if (form.id) {
    return update();
  }

  return create();
};

watch(
  () => form.date,
  () => {
    fetchClosedHours({ date_from: form.date, date_to: form.date }).then(() => {
      form.id = closedHours.value[0]?.id;
      form.type = closedHours.value[0]?.type;
      form.open_date = closedHours.value[0]?.type !== 'Día Completo';
      form.closed_hours = closedHours.value[0]?.closed_hours;
      form.description = closedHours.value[0]?.description;

      hoursSlots.value = CircuitReservationService.getTimeSlots(
        DateTime.fromFormat(form.date, 'yyyy-MM-dd').toFormat('dd/MM/yyyy')
      );

      form.hours_status = [];

      const currentClosedHours = closedHours.value[0]
        ? closedHours.value[0].closed_hours
        : [];

      hoursSlots.value.forEach((element) => {
        form.hours_status.push({
          start: element.start,
          available: !currentClosedHours.includes(element.start),
        });
      });
    });
  }
);

const update = () => {
  editClosedHour(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar el registro');
    } else {
      notifySuccess();
      emit('update:success');
    }
  });
};

const create = async () => {
  await storeClosedHour(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear el registro');
    } else {
      notifySuccess('Nuevo tipo de producto creado correctamente');
      emit('create:success');
    }
  });
};
</script>
