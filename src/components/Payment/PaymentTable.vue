<template>
  <GeneralTable
    :rows="paymentsByClient"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    no-header
    @search="fetchPayments(filters)"
    @navigate-to="navigateTo"
  >
    <template #locator="{ data }">
      <q-td :auto-width="true">
        <q-btn
          flat
          color="primary"
          :label="data.row.order.locator"
          :to="{
            name: 'orders.show',
            params: { id: data.row.order_id },
          }"
        />
      </q-td>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePaymentStore } from '../../stores/payment';
import GeneralTable from '../../components/GeneralTable.vue';
import { reactive, computed } from 'vue';
import FormatService from 'src/services/FormatService';

const props = defineProps({
  clientId: Number,
});

const { payments, loading, error, pagination } = storeToRefs(usePaymentStore());
const { fetchPayments } = usePaymentStore();
const filters = reactive({
  client_id: props.clientId,
});

const paymentsByClient = computed(() =>
  payments?.value.filter((p) => p.order.client_id === props.clientId)
);

const columns = [
  { name: 'actions' },
  { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
  {
    name: 'type',
    align: 'left',
    label: 'Tipo',
    field: 'type',
    sortable: false,
  },
  {
    name: 'amount',
    required: true,
    label: 'Importe',
    align: 'left',
    field: (row) => FormatService.setCurrencyFormat(row.amount),
    sortable: false,
  },
  {
    name: 'locator',
    align: 'left',
    label: 'Localizador de compra',
    field: (row) => row.order.locator,
    sortable: false,
  },
  {
    name: 'paid_date',
    align: 'left',
    label: 'Fecha',
    field: (row) => FormatService.setFullDateFormat(row.paid_date),
    sortable: false,
  },
  {
    name: 'created_by',
    align: 'left',
    label: 'Cobrado por',
    field: (row) => row.createdByUser.name,
    sortable: false,
  },
];

fetchPayments(filters);

const navigateTo = (page) => {
  filters.page = page;
  fetchPayments(filters);
};
</script>
