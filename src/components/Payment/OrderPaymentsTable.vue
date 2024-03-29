<template>
  <q-table
    :rows="payments"
    :columns="columns"
    row-key="id"
    hide-bottom
    :rows-per-page-options="[0]"
  >
    <template #body-cell-type="props">
      <q-td>
        <span class="text-dark-blue cursor-pointer">{{ props.row.type }}</span>
        <q-popup-edit
          v-slot="scope"
          v-model="props.row.type"
          title="Forma de pago"
          buttons
          persistent
          @hide="updatePayment(props.row)"
        >
          <q-select
            v-model="scope.value"
            style="min-width: 150px"
            :options="['Efectivo', 'Tarjeta de Crédito', 'Transferencia']"
            dense
          />
        </q-popup-edit>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import FormatService from 'src/services/FormatService';
import { usePaymentStore } from 'stores/payment.js';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';

const { editPayment } = usePaymentStore();
const { error: paymentError } = storeToRefs(usePaymentStore());
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();

defineProps({
  payments: {
    type: Object,
    default: null,
  },
});

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
    name: 'paid_amount',
    required: true,
    label: 'Cantidad pagada',
    align: 'left',
    field: (row) => FormatService.setCurrencyFormat(row.paid_amount),
    sortable: false,
  },
  {
    name: 'returned_amount',
    required: true,
    label: 'Cantidad devuelta',
    align: 'left',
    field: (row) => FormatService.setCurrencyFormat(row.returned_amount),
    sortable: false,
  },
  {
    name: 'paid_date',
    align: 'left',
    label: 'Fecha',
    field: (row) => FormatService.setFullDateFormat(row.paid_date),
    sortable: false,
  },
];

const paymentForm = reactive({
  id: null,
  type: null,
});

const updatePayment = (payment) => {
  console.log(payment);
  paymentForm.id = payment.id;
  paymentForm.type = payment.type;
  paymentForm.order_id = payment.order_id;
  paymentForm.due_date = payment.due_date;
  paymentForm.paid_date = payment.paid_date;
  paymentForm.amount = payment.amount;
  paymentForm.paid_amount = payment.paid_amount;
  paymentForm.returned_amount = payment.returned_amount;

  editPayment(paymentForm).then(() => {
    if (paymentError.value === null) {
      notifySuccess('Pago actualizado correctamente.');
    } else {
      notifyError(
        'Ha ocurrido un error inesperado al intentar guardar el pago.'
      );
    }
  });
};
</script>
