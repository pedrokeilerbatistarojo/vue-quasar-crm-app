<template>
  <div v-if="!hideClient" class="row justify-between">
    <div><b>Cliente:</b>{{ clientName }}</div>
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
        <q-input
          v-model="form.date"
          type="date"
          stack-label
          dense
          label="Fecha"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4">
        <TreatmentReservationHourPicker
          v-model="form.time"
          :date="form.date"
          :duration="form.duration"
          :employee-id="form.employee_id"
          :reservation-id="reservation?.id"
          @update:save="handleButtonSaveActive"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="form.duration"
          type="number"
          dense
          label="Duración (mins.)"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4">
        <q-toggle v-model="form.used" label="Usada" />
      </div>
      <div class="col-12 col-md-8">
        <EmployeeSelect
          v-if="!loadingEmployees"
          v-model="form.employee_id"
          :options="employeesOptions"
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
            :loading="loading"
            class="full-width"
            :label="!isEditing ? 'Crear y notificar' : 'Editar y notificar'"
            flat
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
            class="q-ml-md full-width"
            label="Cancelar"
            @click="$emit('cancel')"
          />
        </div>
      </div>
      <div>
        <SecondaryButton
          v-if="isEditing"
          class="q-ml-md bg-red text-white full-width"
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
import { reactive, ref, computed, watch } from 'vue';
import SelectClientDialog from 'src/components/Client/SelectClientDialog.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import { useTreatmentReservationStore } from 'src/stores/treatmentReservation';
import { useEmployeeTimeOffStore } from 'src/stores/employeeTimeOff';
import ValidationErrorsList from 'src/components/Form/ValidationErrorsList.vue';
import { useEmployeeStore } from 'src/stores/employee';
import { storeToRefs } from 'pinia';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import { DateTime } from 'luxon';
import { onMounted } from 'vue';
import SecondaryButton from '../Buttons/SecondaryButton.vue';
import InputValidationService from 'src/services/InputValidationService';
import EmployeeSelect from '../Form/EmployeeSelect.vue';
import TreatmentReservationHourPicker from './TreatmentReservationHourPicker.vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  client: Object,
  orderDetailId: Number,
  reservation: Object,
  hideClient: Boolean,
});
const emit = defineEmits([
  'created:success',
  'updated:success',
  'cancel',
  'deleted:success',
]);
const reservationData = computed(() => props.reservation);

const {
  storeTreatmentReservation,
  editTreatmentReservation,
  deleteTreatmentReservation,
} = useTreatmentReservationStore();
const { validationsErrors, error } = storeToRefs(
  useTreatmentReservationStore()
);
const { fetchEmployeesTimeOff } = useEmployeeTimeOffStore();
const { employeesTimeOff } = storeToRefs(useEmployeeTimeOffStore());

const { fetchEmployees } = useEmployeeStore();
const { employees, loading: loadingEmployees } = storeToRefs(
  useEmployeeStore()
);
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();

const $q = useQuasar();

const handleButtonSaveActive = (valid) => {
  isValidForm.value = valid;
};

const isValidForm = ref(false);
const showClientSelection = ref(false);
const detailId = computed(() => props.orderDetailId);
const isEditing = ref(false);
const defaultClient = computed(() => props.client || props.reservation.client);
const mainLabel = computed(() =>
  isEditing.value ? 'Editar reserva' : 'Crear nueva reserva'
);

const loading = ref(false);

const form = reactive({
  id: reservationData.value?.id,
  client: defaultClient,
  client_id: reservationData.value?.client_id,
  order_detail_id: reservationData.value
    ? reservationData.value.order_detail_id
    : detailId,
  date: reservationData.value
    ? reservationData.value.date
    : DateTime.now().toISODate(),
  time: reservationData.value?.time,
  duration: reservationData.value?.duration,
  employee_id: reservationData.value?.employee_id,
  used: reservationData.value ? reservationData.value.used : false,
  notes: reservationData.value?.notes,
  notify: false,
});

fetchEmployees({ is_specialist: true, paginate_size: 100 });

onMounted(() => {
  if (props.reservation) {
    isEditing.value = true;
    isValidForm.value = true;
  }
  fetchEmployeesTimeOff({
    type: 'Día Completo',
    date_from: form.date + ' 00:00:00',
    date_to: form.date + ' 23:59:59',
  });
});

const clientName = computed(() =>
  form.client ? ClientService.getFullName(form.client) : ''
);

const employeesOptions = computed(() =>
  employees.value.filter((employee) => {
    let pass = true;
    for (const timeOff of employeesTimeOff.value) {
      if (timeOff.employee_id === employee.id) {
        pass = false;
        break;
      }
    }
    return pass;
  })
);

watch(form, (form) => {
  if (form.date) {
    fetchEmployeesTimeOff({
      type: 'Día Completo',
      date_from: form.date + ' 00:00:00',
      date_to: form.date + ' 23:59:59',
    });
  }
});

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
  await storeTreatmentReservation(form).then(() => {
    loading.value = false;
    if (error.value) {
      notifyError(
        'Ha ocurrido un error al intentar crear el registro para el cliente'
      );
    } else {
      notifySuccess('Reserva creada correctamente.');

      emit('created:success');
    }
  });
};
const updateReservation = async () => {
  form.client_id = form.client.id;
  await editTreatmentReservation(form).then(() => {
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
      deleteTreatmentReservation(props.reservation.id).then(() => {
        if (error.value === null) {
          emit('deleted:success');
        }
      });
    })
    .onCancel(() => {});
};
</script>
