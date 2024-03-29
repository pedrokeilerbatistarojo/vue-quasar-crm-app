<template>
  <div v-if="!hideClient" class="row justify-between">
    <div><b>Cliente:</b> {{ clientName }}</div>
    <PrimaryButton
      class="q-ml-sm"
      label="Cambiar cliente"
      @click="showClientSelection = true"
    />
  </div>
  <div class="row"></div>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit.prevent="onSubmit">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4">
        <CircuitReservationDatePicker
          v-model="form.date"
          required
          :rules="[(val) => InputValidationService.required(val)]"
          label="Fecha"
          stack-label
        />
      </div>
      <div class="col-12 col-md-4">
        <CircuitReservationHourPicker
          v-model="form.time"
          :date="form.date"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="form.duration"
          type="number"
          dense
          label="Duración (mins.)"
          required
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-3">
        <q-toggle v-model="form.used" label="Usada" />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="form.adults"
          type="number"
          dense
          label="Adultos"
          required
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="form.children"
          type="number"
          dense
          label="Niños"
          required
        />
      </div>
      <div v-if="isEditing || preReservation" class="col-12 col-md-3">
        <q-input
          v-model="form.treatment_reservations"
          type="number"
          :readonly="isEditing"
          dense
          label="Masajes de pre-reserva"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <q-input
          v-model="form.notes"
          type="textarea"
          label="Notas de la reserva"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-input v-model="form.schedule_note" label="Nota para agenda" />
      </div>
    </div>
    <div class="row q-mt-lg justify-between">
      <div class="row q-gutter-md q-mb-lg">
        <div>
          <PrimaryButton
            class="full-width"
            :label="mainLabel"
            flat
            type="submit"
            :disabled="!isValidForm"
          />
        </div>

        <div>
          <PrimaryButton
            class="full-width"
            :label="!isEditing ? 'Crear y notificar' : 'Editar y notificar'"
            flat
            :loading="loading"
            type="submit"
            :disabled="!isValidForm"
            @click="
              form.notify = true;
              loading = true;
            "
          />
        </div>

        <div>
          <SecondaryButton
            class="full-width q-ml-md"
            label="Cancelar"
            @click="$emit('cancel')"
          />
        </div>
      </div>
      <div>
        <SecondaryButton
          v-if="isEditing"
          class="full-width q-ml-md bg-red text-white"
          label="Cancelar reserva"
          @click="confirmDelete"
        />
      </div>
    </div>
  </q-form>
  <SelectClientDialog
    v-model="showClientSelection"
    @client:selected="clientSelected"
    @cancel="showClientSelection = false"
  />
</template>

<script setup>
import ClientService from 'src/services/ClientService';
import { reactive, ref, computed, onMounted } from 'vue';
import SelectClientDialog from 'src/components/Client/SelectClientDialog.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import { useCircuitReservationStore } from 'src/stores/circuitReservation';
import ValidationErrorsList from 'src/components/Form/ValidationErrorsList.vue';
import { storeToRefs } from 'pinia';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import { DateTime } from 'luxon';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import { useQuasar } from 'quasar';
import InputValidationService from 'src/services/InputValidationService';
import CircuitReservationDatePicker from './CircuitReservationDatePicker.vue';
import CircuitReservationHourPicker from './CircuitReservationHourPicker.vue';

const props = defineProps({
  client: Object,
  orderDetailId: Number,
  reservation: Object,
  hideClient: Boolean,
  preReservation: Boolean,
});
const emit = defineEmits([
  'created:success',
  'updated:success',
  'cancel',
  'deleted:success',
]);
const $q = useQuasar();

const {
  storeCircuitReservation,
  editCircuitReservation,
  deleteCircuitReservation,
} = useCircuitReservationStore();
const { validationsErrors, error } = storeToRefs(useCircuitReservationStore());
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();

const showClientSelection = ref(false);
const detailId = computed(() => props.orderDetailId);
const isEditing = ref(false);
const defaultClient = computed(() => props.client || props.reservation.client);
const mainLabel = computed(() =>
  isEditing.value ? 'Editar reserva' : 'Crear reserva'
);

const loading = ref(false);

const form = reactive({
  id: props.reservation?.id,
  client: defaultClient,
  client_id: props.reservation?.client_id,
  order_detail_id: detailId,
  date: props.reservation ? props.reservation.date : DateTime.now().toISODate(),
  time: props.reservation?.time,
  duration: props.reservation?.duration,
  adults: props.reservation ? props.reservation.adults : 0,
  children: props.reservation ? props.reservation.children : 0,
  used: props.reservation ? props.reservation.used : false,
  notes: props.reservation?.notes,
  schedule_note: props.reservation?.schedule_note,
  treatment_reservations: props.reservation?.treatment_reservations,
  notify: false,
});

onMounted(() => {
  if (props.reservation) {
    isEditing.value = true;
  }
});

const clientName = computed(() =>
  form.client ? ClientService.getFullName(form.client) : ''
);

const clientSelected = (client) => {
  showClientSelection.value = false;
  form.client = client;
};

const onSubmit = () => {
  if (isEditing.value) {
    return updateReservation();
  }

  return createReservation();
};

const createReservation = async () => {
  form.client_id = form.client.id;

  if (form.children === null) {
    form.children = 0;
  }

  if (form.adults === null) {
    form.adults = 0;
  }

  if (!props.preReservation || form.treatment_reservations <= 0) {
    form.treatment_reservations = null;
  }

  await storeCircuitReservation(form).then(() => {
    loading.value = false;
    if (error.value) {
      notifyError('Ha ocurrido un error al intentar crear la reserva');
    } else {
      notifySuccess('Reserva creada correctamente.');

      emit('created:success');
    }
  });
};

const updateReservation = async () => {
  form.client_id = form.client.id;
  await editCircuitReservation(form).then(() => {
    loading.value = false;
    if (error.value) {
      notifyError('Ha ocurrido un error al intentar editar la reserva');
    } else {
      notifySuccess('Reserva editada correctamente.');

      emit('updated:success');
    }
  });
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar reserva',
    message:
      '¿Está seguro que desea eliminar esta reserva? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteCircuitReservation(props.reservation.id).then(() => {
        if (error.value === null) {
          emit('deleted:success');
        }
      });
    })
    .onCancel(() => {});
};

const isValidForm = () => true;
</script>
