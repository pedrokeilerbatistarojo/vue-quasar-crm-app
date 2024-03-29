<template>
  <p><b>ID Caja:</b> {{ saleSession.id }}</p>
  <p><b>Turno:</b> {{ saleSession.session_type }}</p>
  <p>
    <b>Fecha de apertura:</b>
    {{ FormatService.setFullDateFormat(saleSession.start_date) }}
  </p>
  <p><b>Importe inicial:</b> {{ saleSession.start_amount }}</p>
  <p><b>Abierta por:</b> {{ saleSession.createdByUser?.name }}</p>
  <p>
    <b>Efectivo:</b>
    {{ cash }}
  </p>
  <p>
    <b>Tarjeta de Crédito:</b>
    {{ creditCard }}
  </p>
  <p>
    <b>Transferencia:</b>
    {{ transfer }}
  </p>
  <p>
    <b>Total de ventas:</b>
    {{ totalSale }}
  </p>
  <SectionTitle>Pagos</SectionTitle>
  <br />
  <br />
  <q-table
    row-key="id"
    flat
    bordered
    no-header
    hide-bottom
    :rows="payments"
    :columns="columns"
    :rows-per-page-options="[0]"
  >
    <template #body-cell-client="scope">
      <q-td>
        <q-btn
          flat
          color="primary"
          :label="scope.row.client"
          :to="{ name: 'clients.show', params: { id: scope.row.client_id } }"
        />
      </q-td>
    </template>
    <template #body-cell-locator="scope">
      <q-td :auto-width="true">
        <q-btn
          flat
          color="primary"
          :label="scope.row.order_locator"
          :to="{
            name: 'orders.show',
            params: { id: scope.row.order_id },
          }"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import FormatService from 'src/services/FormatService';
import SectionTitle from 'src/components/SectionTitle.vue';
import { useSaleSessionStore } from 'src/stores/saleSession';
import { storeToRefs } from 'pinia';

const props = defineProps({
  saleSession: Object,
});

const { payments, cash, transfer, creditCard, totalSale } = storeToRefs(
  useSaleSessionStore()
);

const columns = [
  { name: 'actions' },
  { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
  {
    name: 'client',
    align: 'left',
    label: 'Cliente',
    sortable: false,
  },
  {
    name: 'type',
    align: 'left',
    label: 'Forma de pago',
    field: 'type',
    sortable: false,
  },
  {
    name: 'amount',
    align: 'left',
    label: 'Importe',
    field: (row) => FormatService.setCurrencyFormat(row.amount),
    sortable: false,
  },
  {
    name: 'locator',
    align: 'left',
    label: 'Localizador',
    sortable: false,
  },
  {
    name: 'date',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: (row) => FormatService.setFullDateFormat(row.paid_date),
    sortable: false,
  },
];
</script>
