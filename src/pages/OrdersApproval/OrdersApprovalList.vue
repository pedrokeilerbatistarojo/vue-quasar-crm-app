<template>
  <SectionTitle>Ventas de la web</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Aprobar y pasar a caja actual"
    :disabled="!currentSaleSession"
    @click="approve"
  />
  <q-table
    v-model:selected="selected"
    class="my-sticky-header-table"
    :rows="orderApprovals"
    :loading="loading"
    :columns="columns"
    row-key="id"
    :selected-rows-label="getSelectedString"
    selection="multiple"
    :pagination="{ rowsPerPage: filters.paginate_size }"
    :rows-per-page-options="[3, 5, 7, 10, 50, 0]"
    @update:pagination="updatePagination"
  >
    <template #top>
      <div class="row full-width">
        <div class="col-11">
          <div class="row q-col-gutter-md">
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
            <div class="col-12 col-sm-6 col-md-4">
              <q-select
                v-model="filters.is_reservation"
                dense
                :options="typeList"
                label="Tipo de venta"
                clearable
                emit-value
                map-options
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
            <div class="col-12 col-sm-6 col-md-4">
              <TextInput
                v-model="filters.email"
                label="Correo electrónico"
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
      <q-tr
        :props="props"
        :class="{
          'main-row': true,
          'bg-warning-row': props.row.is_duplicated,
        }"
      >
        <td>
          <q-checkbox
            v-if="!props.row.is_duplicated"
            v-model="props.selected"
          />
          <q-btn v-else icon="delete" @click="deleteApproval(props.row.id)" />
        </td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'actions'">
            <q-btn
              size="sm"
              round
              dense
              :icon="props.expand ? 'remove' : 'add'"
              @click="props.expand = !props.expand"
            />
          </template>
          <template v-else>
            {{ col.value }}
          </template>
        </q-td>
      </q-tr>
      <q-tr
        v-show="props.expand"
        :key="props.row.index"
        class="q-tr--no-hover"
        :props="props"
      >
        <q-td colspan="100%">
          <div class="text-left">
            <OrderDetailsTable
              :order-details="prepareDetailsData(props.row.order_data.details)"
              hide-reservations
              no-link
            />
          </div>
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
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import DateFilter from 'src/components/Filter/DateFilter.vue';
import TextInput from 'src/components/Form/TextInput.vue';
import { ref, computed, onMounted, reactive } from 'vue';
import { useOrderApprovalStore } from 'src/stores/ordersApproval';
import { storeToRefs } from 'pinia';
import FormatService from 'src/services/FormatService';
import OrderDetailsTable from 'src/components/Order/OrderDetailsTable.vue';
import PaginationBanner from 'src/components/PaginationBanner.vue';
import { useQuasar } from 'quasar';
import { useSaleSessionStore } from 'src/stores/saleSession';
import InputValidationService from 'src/services/InputValidationService';

const props = defineProps({
  clientId: {
    type: Number,
    required: false,
    default: null,
  },
});

const { fetchOrderApprovals, deleteOrderApprove, processApproved } =
  useOrderApprovalStore();
const { orderApprovals, pagination, error, loading } = storeToRefs(
  useOrderApprovalStore()
);
const paginationData = computed(() => pagination.value);
const $q = useQuasar();

const { currentSaleSession } = storeToRefs(useSaleSessionStore());
const { fetchCurrentSaleSession } = useSaleSessionStore();

onMounted(() => {
  fetchCurrentSaleSession();
});

fetchOrderApprovals();

const approve = () => {
  const ids = selected.value
    .filter((row) => !row.is_duplicated)
    .map((row) => row.id);

  processApproved(ids.toString()).then(() => (selected.value = []));
};

const filters = reactive({
  locator: null,
  client: null,
  client_id: props.clientId,
  created_at_from: null,
  created_at_to: null,
  paginate_size: 10,
  page: null,
  is_reservation: null,
  email: null,
});

const typeList = [
  { label: 'Reservas', value: 1 },
  { label: 'Compras', value: 0 },
];

const columns = [
  { name: 'actions' },
  {
    name: 'desc',
    required: true,
    label: 'Localizador',
    align: 'left',
    field: 'locator',
    sortable: true,
  },
  {
    name: 'client',
    align: 'left',
    label: 'Cliente',
    field: (row) => row.order_data.user.fullname,
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Correo Electrónico',
    field: (row) => row.order_data.user.email,
    sortable: true,
  },
  {
    name: 'date',
    label: 'Fecha',
    align: 'left',
    field: (row) => FormatService.setFullDateFormat(row.order_data.date),
    sortable: true,
  },
  {
    name: 'amount',
    label: 'Importe total',
    align: 'left',
    field: (row) => row.order_data.total_price,
  },
];

const selected = ref([]);
const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} registros${
        selected.value.length > 1 ? 's' : ''
      } seleccionados de ${orderApprovals.value.length}`;
};

const prepareDetailsData = (details) =>
  details.map((detail) => {
    detail.quantity = detail.qty;
    detail.product_name = detail.name;

    return detail;
  });

const search = () => {
  filters.page = 1;
  const params = prepareFilters();

  fetchOrderApprovals(params);
};

const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  filters.page = 1;
  const params = prepareFilters();

  fetchOrderApprovals(params);
};

const navigateTo = (page) => {
  filters.page = page;
  const params = prepareFilters();

  fetchOrderApprovals(params);
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

const deleteApproval = (id) => {
  $q.dialog({
    title: 'Borrar registro',
    message: '¿Está seguro que desea borrar el registro?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteOrderApprove(id);
      if (error) {
      }
    })
    .onCancel(() => {});
};
</script>
