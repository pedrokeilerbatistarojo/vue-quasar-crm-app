<template>
  <q-table
    class="my-sticky-header-table"
    :rows="orders"
    :columns="columns"
    row-key="id"
    flat
    bordered
    :pagination="{ rowsPerPage: filters.paginate_size }"
    :rows-per-page-options="[3, 5, 7, 10, 15, 20, 25, 50]"
    :loading="loading"
    wrap-cells
    @update:pagination="updatePagination"
  >
    <template #top>
      <div class="row full-width">
        <div class="col-11">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4">
              <TextInput
                v-model="filters.ticket_number"
                label="Número de ticket"
                @keyup.enter="search()"
              />
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <q-select
                v-model="filters.type"
                dense
                :options="typeList"
                label="Tipo de venta"
                clearable
                @keyup.enter="search()"
              />
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <TextInput
                v-model="filters.locator"
                label="Localizador"
                @keyup.enter="search()"
              />
            </div>
            <div v-if="!filters.client_id" class="col-12 col-sm-6 col-md-4">
              <TextInput
                v-model="filters.client"
                label="Cliente"
                @keyup.enter="search()"
              />
            </div>
            <div v-if="!filters.client_id" class="col-12 col-sm-6 col-md-4">
              <TextInput
                v-model="filters.telephone_sale_seq"
                label="Venta telefónica"
                @keyup.enter="search()"
              />
            </div>
            <div v-if="!filters.client_id" class="col-12 col-sm-6 col-md-4">
              <TextInput
                v-model="filters.counter_sale_seq"
                label="Venta de mostrador"
                @keyup.enter="search()"
              />
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <DateFilter
                v-model="filters.created_at_from"
                label="Fecha desde"
                @keyup.enter="search()"
              />
            </div>
            <div class="col-12 col-md-4">
              <DateFilter
                v-model="filters.created_at_to"
                label="Fecha hasta"
                @keyup.enter="search()"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="filters.created_by"
                dense
                clearable
                label="Cobrado por"
                :options="usersOptions"
                @keyup.enter="search()"
              />
            </div>
          </div>
        </div>
        <div class="col-1 text-right">
          <q-btn flat icon="search" class="q-mt-sm" @click="search" />
        </div>
      </div>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            class="btn-expand"
            size="sm"
            color="bronze"
            text-color="white"
            round
            dense
            :icon="props.expand ? 'remove' : 'add'"
            @click="props.expand = !props.expand"
          />
        </q-td>
        <q-td>
          <q-btn
            stretch
            flat
            icon="visibility"
            :to="{ name: 'orders.show', params: { id: props.row.id } }"
          />
        </q-td>

        <q-td>{{ props.row.ticket_number }}</q-td>
        <q-td>{{ props.row.type }}</q-td>

        <q-td auto-width class="text-center">
          <q-btn
            v-if="props.row.type === 'Cliente'"
            flat
            color="primary"
            :label="[props.row.client.name].join(' ')"
            :to="{ name: 'clients.show', params: { id: props.row.client.id } }"
          />
          <span v-if="props.row.type === 'Venta Telefónica'">
            {{ props.row.telephone_sale_seq }}</span
          >
          <span v-if="props.row.type === 'Venta de Mostrador'">
            {{ props.row.counter_sale_seq }}</span
          >
        </q-td>

        <q-td>
          {{ props.row.locator }}
        </q-td>
        <q-td>
          {{ FormatService.setFullDateFormat(props.row.created_at) }}
        </q-td>
        <q-td>
          {{ FormatService.setCurrencyFormat(props.row.total_price) }}
        </q-td>
        <q-td>
          {{ props.row.createdByUser?.name }}
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="q-mt-md">
            <SecondaryButton
              class="q-mr-md"
              label="Ver ticket"
              icon="description"
              @click="downloadPdfTicket(props.row.id)"
            />
            <SecondaryButton
              label="Enviar ticket"
              icon="send"
              @click="sendPdfTicket(props.row)"
            />
          </div>

          <OrderDetailsTable
            v-if="props.row.orderDetails"
            :order-details="props.row.orderDetails"
            hide-reservations
          />
          <div v-else>Compra sin detalles</div>
        </q-td>
      </q-tr>
    </template>

    <template #pagination>
      <PaginationBanner
        :pagination-data="paginationData"
        @navigate-to="navigateTo"
      />
    </template>
  </q-table>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import OrderDetailsTable from 'src/components/Order/OrderDetailsTable.vue';
import PaginationBanner from 'src/components/PaginationBanner.vue';
import { useErrorNotification } from 'src/composables/errorNotification';
import { usePdfUtils } from 'src/composables/pdfUtils';
import { useSuccessNotification } from 'src/composables/successNotification';
import FormatService from 'src/services/FormatService';
import { computed, onMounted, reactive } from 'vue';
import { useOrderStore } from '../../stores/order';
import { useUserStore } from '../../stores/user';
import SecondaryButton from '../Buttons/SecondaryButton.vue';
import DateFilter from '../Filter/DateFilter.vue';
import TextInput from '../Form/TextInput.vue';
import InputValidationService from 'src/services/InputValidationService';

const props = defineProps({
  clientId: {
    type: Number,
    required: false,
    default: null,
  },
});

const { error, orders, loading, pagination, pdfTicket } = storeToRefs(
  useOrderStore()
);
const { users } = storeToRefs(useUserStore());
const { fetchUsers } = useUserStore();
const { fetchOrders, getPdfTicket, sendTicketMail } = useOrderStore();
const { notifyError } = useErrorNotification();
const { notifySuccess } = useSuccessNotification();
const { dataURItoBlob } = usePdfUtils();
const $q = useQuasar();

onMounted(() => {
  fetchUsers();
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

const filters = reactive({
  ticket_number: null,
  type: null,
  locator: null,
  client: null,
  client_id: props.clientId,
  created_at_from: null,
  created_at_to: null,
  paginate_size: 10,
  page: null,
  telephone_sale_seq: null,
  created_by: null,
});

const sendTicketForm = reactive({
  id: null,
  email: '',
});

const typeList = ['Cliente', 'Venta Telefónica', 'Venta de Mostrador'];

const columns = [
  { name: 'expandingColumn' },
  { name: 'actions' },
  {
    name: 'ticket_number',
    required: true,
    align: 'left',
    label: 'Número de ticket',
  },
  {
    name: 'type',
    required: true,
    align: 'left',
    label: 'Tipo de venta',
  },
  { name: 'client', required: true, align: 'center', label: 'Cliente' },
  {
    name: 'locator',
    required: true,
    align: 'left',
    label: 'Localizador venta online',
  },
  {
    name: 'date',
    align: 'left',
    label: 'Fecha',
    sortable: false,
  },
  {
    name: 'total_amount',
    align: 'left',
    label: 'Importe',
    sortable: false,
  },
  {
    name: 'createdBy',
    align: 'left',
    label: 'Creado por',
    sortable: false,
  },
];

fetchOrders(filters);

const search = () => {
  filters.page = 1;
  let params = prepareFilters();

  fetchOrders(params);
};

const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  filters.page = 1;

  let params = prepareFilters();
  fetchOrders(params);
};

const navigateTo = (page) => {
  filters.page = page;

  let params = prepareFilters();
  fetchOrders(params);
};

const downloadPdfTicket = (id) => {
  getPdfTicket(id)
    .then(() => {
      const blob = dataURItoBlob(pdfTicket.value.content);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    })
    .catch(() =>
      notifyError('Ha ocurrido un error al intentar descargar el PDF.')
    );
};

const sendPdfTicket = (order) => {
  $q.dialog({
    title: 'Enviar ticket de compra por correo electrónico',
    message: 'Correo electrónico',
    prompt: {
      model: order.client.email,
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((email) => {
    sendTicketForm.email = email;
    sendTicketForm.id = order.id;
    sendTicketMail(sendTicketForm).then(() => {
      if (!error) {
        notifySuccess('Correo enviado satisfactoriamente.');
      }
    });
  });
};

const prepareFilters = () => {
  let params = { ...filters };

  if (InputValidationService.isDateSet(params.created_at_from)) {
    params.created_at_from = params.created_at_from + ' 00:00:00';
  }
  if (InputValidationService.isDateSet(params.created_at_to)) {
    params.created_at_to = params.created_at_to + ' 23:59:59';
  }

  return params;
};
</script>
