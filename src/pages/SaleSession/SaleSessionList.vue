<template>
  <SectionTitle>Historial de cajas</SectionTitle>
  <GeneralTable
    :rows="saleSessions"
    :columns="columns"
    :loading="loading"
    viewable
    show-route-name="sale-sessions.show"
    :pagination="pagination"
    @search="search()"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #actions="{ rowId }">
      <q-btn
        stretch
        flat
        icon="description"
        @click="downloadSessionInfo(rowId)"
      >
        <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
          Cierre de cajas
        </q-tooltip>
      </q-btn>
      <q-btn stretch flat icon="payments" @click="downloadPaymentsInfo(rowId)">
        <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
          Informe de cobros
        </q-tooltip>
      </q-btn>
    </template>
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-2">
          <q-input
            v-model="filters.id"
            clearable
            dense
            label="Código"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.session_type"
            clearable
            dense
            label="Turno"
            @keyup.enter="search()"
          />
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.start_date_from"
            dense
            type="date"
            label="Fecha de apertura desde"
            stack-label
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.start_date_to"
            dense
            type="date"
            label="Fecha de apertura hasta"
            stack-label
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.end_date_from"
            dense
            type="date"
            label="Fecha de apertura desde"
            stack-label
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="filters.end_date_to"
            dense
            type="date"
            label="Fecha de apertura hasta"
            stack-label
            @keyup.enter="search()"
          />
        </div>
      </div>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import SectionTitle from 'src/components/SectionTitle.vue';
import GeneralTable from '../../components/GeneralTable.vue';
import { useSaleSessionStore } from 'src/stores/saleSession';
import { reactive } from 'vue';
import FormatService from 'src/services/FormatService';
import { usePdfUtils } from 'src/composables/pdfUtils';

const { saleSessions, loading, pagination, pdfInfo } = storeToRefs(
  useSaleSessionStore()
);
const { fetchSaleSessions, getPdfInfo, getPdfPayments } = useSaleSessionStore();
const { dataURItoBlob } = usePdfUtils();

const filters = reactive({
  id: null,
  session_type: null,
  start_date_from: null,
  start_date_to: null,
  end_date_from: null,
  end_date_to: null,
});

const columns = [
  { name: 'actions' },
  { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
  {
    name: 'session_type',
    required: true,
    label: 'Turno',
    align: 'left',
    field: 'session_type',
    sortable: false,
  },
  {
    name: 'start_date',
    align: 'left',
    label: 'Fecha de apertura',
    field: (row) => FormatService.setFullDateFormat(row.start_date),
    sortable: false,
  },
  {
    name: 'created_by',
    align: 'left',
    label: 'Abierta por',
    field: (row) => row.createdByUser.name,
    sortable: false,
  },
  {
    name: 'end_date',
    align: 'left',
    label: 'Fecha de cierre',
    field: (row) =>
      row.end_date ? FormatService.setFullDateFormat(row.end_date) : null,
    sortable: false,
  },
  {
    name: 'closed_by',
    align: 'left',
    label: 'Cerrada por',
    field: (row) => row.closedByUser?.name,
    sortable: false,
  },
  {
    name: 'end_amount',
    align: 'left',
    label: 'Importe al cierre',
    field: (row) => FormatService.setCurrencyFormat(row.end_amount),
    sortable: false,
  },
];

const navigateTo = (page) => {
  filters.page = page;
  const params = prepareFilters();

  fetchSaleSessions(params);
};
fetchSaleSessions();

const search = () => {
  filters.page = 1;
  const params = prepareFilters();

  fetchSaleSessions(params);
};

const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  const params = prepareFilters();
  fetchSaleSessions(params);
};

const prepareFilters = () => {
  const params = { ...filters };

  if (params.start_date_from !== undefined && params.start_date_from !== null) {
    params.start_date_from = params.start_date_from + ' 00:00:00';
  }
  if (params.start_date_to !== undefined && params.start_date_to !== null) {
    params.start_date_to = params.start_date_to + ' 23:59:59';
  }
  if (params.end_date_from !== undefined && params.end_date_from !== null) {
    params.end_date_from = params.end_date_from + ' 00:00:00';
  }
  if (params.end_date_to !== undefined && params.end_date_to !== null) {
    params.end_date_to = params.end_date_to + ' 23:59:59';
  }

  return params;
};

const downloadSessionInfo = (id) => {
  getPdfInfo(id).then(() => {
    const blob = dataURItoBlob(pdfInfo.value.content);
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  });
};
const downloadPaymentsInfo = (id) => {
  getPdfPayments(id).then(() => {
    const blob = dataURItoBlob(pdfInfo.value.content);
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  });
};
</script>
