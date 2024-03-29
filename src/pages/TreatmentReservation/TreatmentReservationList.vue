<template>
  <SectionTitle>Masajes y Tratamientos</SectionTitle>
  <GeneralTable
    :rows="treatmentReservations"
    :columns="columns"
    :loading="loading"
    :pagination="paginationData"
    editable
    emaileable
    edit-route-name="treatment-reservations.edit"
    @search="fetchTreatmentReservations(filters)"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
    @mail="handleMail"
  >
    <template #locator="{ data }">
      <q-td :auto-width="true">
        <q-btn
          v-if="data.row.orderDetails && data.row.orderDetails[0].order.locator"
          flat
          color="primary"
          :label="data.row.orderDetails[0].order.locator"
          :to="{
            name: 'orders.show',
            params: { id: data.row.orderDetails[0].order_id },
          }"
        />
      </q-td>
    </template>
    <template #ticket="{ data }">
      <q-td :auto-width="true">
        <q-btn
          v-if="data.row.orderDetails"
          flat
          color="primary"
          :label="data.row.orderDetails[0].order.ticket_number"
          :to="{
            name: 'orders.show',
            params: { id: data.row.orderDetails[0].order_id },
          }"
        />
      </q-td>
    </template>
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.locator"
            clearable
            dense
            label="Localizador"
            stack-label
            @keyup.enter="fetchTreatmentReservations(filters)"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.date_from"
            type="date"
            dense
            label="Fecha desde"
            placeholder=""
            stack-label
            @keyup.enter="fetchTreatmentReservations(filters)"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.date_to"
            type="date"
            dense
            label="Fecha hasta"
            stack-label
            @keyup.enter="fetchTreatmentReservations(filters)"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.time"
            clearable
            dense
            stack-label
            placeholder="HH::mm"
            label="Hora"
            @keyup.enter="fetchTreatmentReservations(filters)"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.used"
            :options="[
              {
                label: 'Sí',
                value: true,
              },
              {
                label: 'No',
                value: false,
              },
            ]"
            emit-value
            map-options
            dense
            clearable
            label="Usada"
            @keyup.enter="fetchTreatmentReservations(filters)"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.client"
            clearable
            dense
            label="Cliente"
            stack-label
            @keyup.enter="fetchTreatmentReservations(filters)"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.created_by"
            dense
            clearable
            map-options
            emit-value
            option-label="label"
            option-value="value"
            label="Creado por"
            :options="usersOptions"
            @keyup.enter="fetchTreatmentReservations(filters)"
          />
        </div>
      </div>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTreatmentReservationStore } from '../../stores/treatmentReservation';
import {computed, onMounted, reactive} from 'vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import FormatService from 'src/services/FormatService';
import GeneralTable from 'src/components/GeneralTable.vue';
import { useQuasar } from 'quasar';
import {useErrorNotification} from "src/composables/errorNotification";
import {useSuccessNotification} from "src/composables/successNotification";
import { useUserStore } from 'stores/user';

const $q = useQuasar();

const {
  treatmentReservations,
  treatmentReservation,
  loading,
  error,
  pagination,
} = storeToRefs(useTreatmentReservationStore());
const {
  fetchTreatmentReservations,
  fetchTreatmentReservation,
  sendTreatmentReservationMail,
} = useTreatmentReservationStore();

const { users } = storeToRefs(useUserStore());
const { fetchUsers } = useUserStore();

const { notifyError } = useErrorNotification();
const { notifySuccess } = useSuccessNotification();

const filters = reactive({
  locator: null,
  from_date: null,
  to_date: null,
  time: null,
  paginate_size: 10,
  client: null,
  created_by: null
});
const paginationData = computed(() => pagination.value);

const usersOptions = computed(() =>
  users.value.map((user) => {
    return {
      label: user.name,
      value: user.id,
    };
  })
);

onMounted(() => {
  fetchUsers();
});

fetchTreatmentReservations();

const navigateTo = (page) => {
  filters.page = page;
  fetchTreatmentReservations(filters);
};
const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  filters.page = 1;
  fetchTreatmentReservations(filters);
};

const sendReservationForm = reactive({
  id: null,
  email: null,
});

const columns = [
  { name: 'actions' },
  {
    name: 'ticket',
    align: 'center',
    label: 'Ticket',
    field: (row) => row.orderDetails?.[0]?.order?.ticket_number,
    sortable: false,
  },
  {
    name: 'locator',
    align: 'center',
    label: 'Localizador',
    field: (row) => row.orderDetails?.[0]?.order?.locator,
    sortable: false,
  },
  {
    name: 'client',
    required: true,
    label: 'Cliente',
    align: 'left',
    field: (row) => [row.client.name].join(' '),
    format: (val) => `${val}`,
    sortable: false,
  },
  {
    name: 'date',
    align: 'center',
    label: 'Fecha',
    field: (row) => FormatService.setDateFormat(row.date),
    sortable: false,
  },
  {
    name: 'time',
    align: 'center',
    label: 'Hora',
    field: 'time',
    sortable: false,
  },
  {
    name: 'used',
    align: 'center',
    label: 'Uso',
    field: (row) => (row.used ? 'Sí' : 'No'),
    sortable: false,
  },
];

const handleMail = (treatmentReservationId) => {
  fetchTreatmentReservation(treatmentReservationId).then(() => {
    $q.dialog({
      title: 'Enviar reserva por correo electrónico',
      message: 'Correo electrónico',
      prompt: {
        model: treatmentReservation.value.client.email,
        type: 'text',
      },
      cancel: true,
      persistent: true,
    }).onOk((email) => {
      sendReservationForm.email = email;
      sendReservationForm.id = treatmentReservation.value.id;
      sendTreatmentReservationMail(sendReservationForm).then(() => {
        if (error.value === null) {
          notifySuccess('Correo enviado satisfactoriamente.');
        }else{
          notifyError('Ha ocurrido un error al enviar el email.');
        }
      });
    });
  });
};
</script>
