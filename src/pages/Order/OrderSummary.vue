<template>
  <p v-if="loading">Cargando datos de la venta...</p>
  <div v-if="order">
    <SectionTitle>Datos de la venta</SectionTitle>
    <div class="row">
      <div class="col">
        <p v-if="order.ticket_number"><b>Código de ticket:</b> {{ order.ticket_number }}</p>
        <p v-if="order.locator"><b>Localizador:</b> {{ order.locator }}</p>
        <p v-if="order.client && order.type === 'Cliente'">
          <b>Cliente: </b>
          <RouterLink
            :to="{ name: 'clients.show', params: { id: order.client.id } }"
          >
            {{ order.client.name }}
          </RouterLink
          >
        </p>
        <p v-if="order.type === 'Venta Telefónica'">
          <b>Venta telefónica: </b>
          {{ order.telephone_sale_seq }}
        </p>
        <p v-if="order.type === 'Venta de Mostrador'">
          <b>Venta de Mostrador: </b>
          {{ order.counter_sale_seq }}
        </p>
      </div>
      <div class="col">
        <p><b>Fecha de venta:</b> {{ orderStore.getCreatedAt }}</p>
        <p><b>Importe total:</b> {{ orderStore.getTotalAmount }}</p>
        <p><b>Estado:</b> {{ orderStore.getStatus }}</p>
      </div>
      <div class="col">
        <p><b>Compra canjeada :</b>
          <q-toggle
            v-model="order.used_purchase"
            @click="handleUsedPurchase"
          />
        </p>
        <p><b>Empresa:</b> {{ order.company?.name }}</p>
        <p><b>Vendido por:</b> {{ order.createdByUser?.name }}</p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <p>
          <q-btn
            style="color: #c8a14d"
            class="q-mr-sm" flat stretch rounded icon="edit" dense
            @click="visibleEditNote = !visibleEditNote"
          >
            <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
              Editar nota
            </q-tooltip>
          </q-btn>
          <b>Notas:</b> {{ order.note }}
        </p>
        <div v-if="visibleEditNote">
          <TextInput
            v-model="order.note"
            class="q-mt-lg"
            label="Notas"
          />
          <SecondaryButton
            class="q-mt-md"
            label="Guardar"
            @click="handleEditNote"
          />
        </div>
      </div>
    </div>
    <!-- <div v-if="!loading && order">
      <OrderForm :order="order" />
    </div> -->

    <OrderDetailsTable
      v-if="order.orderDetails"
      :order-details="order.orderDetails"
      :order-client="order.client"
      :hide-client="order.type !== 'Cliente'"
      @details:updated="
        fetchOrder(
          props.id,
          'company,payments,client,orderDetails.product.productType,orderDetails.circuitReservations.client,orderDetails.treatmentReservations.client,orderDetails.treatmentReservations.employee'
        )
      "
    />

    <SectionTitle class="q-mt-xl">Cartera</SectionTitle>
    <OrderPaymentsTable v-if="order.payments" :payments="order.payments" />
  </div>

  <div class="row q-mt-lg justify-between">
    <GoBackSecondaryButton class="q-mt-lg" />
    <div>
      <SecondaryButton
        v-if="currentSaleSession?.id === order.sale_session_id"
        class="q-ml-md bg-red text-white"
        label="Eliminar venta"
        @click="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import OrderDetailsTable from 'src/components/Order/OrderDetailsTable.vue';
import OrderPaymentsTable from 'src/components/Payment/OrderPaymentsTable.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useOrderStore } from 'stores/order.js';
import { useSaleSessionStore } from 'stores/saleSession.js';
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue';
import GoBackSecondaryButton from '../../components/Buttons/GoBackSecondaryButton.vue';
import SecondaryButton from '../../components/Buttons/SecondaryButton.vue';
import TextInput from 'src/components/Form/TextInput.vue';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const $q = useQuasar();
const router = useRouter();
const orderStore = useOrderStore();
const { order, loading, error } = storeToRefs(useOrderStore());
const { currentSaleSession } = storeToRefs(useSaleSessionStore());
const { fetchOrder, deleteOrder, markUsedPurchaseOrder, editNoteOrder } = useOrderStore();
const { fetchCurrentSaleSession } = useSaleSessionStore();
const { notifySuccess } = useSuccessNotification();

const visibleEditNote = ref(false);

fetchCurrentSaleSession();
fetchOrder(
  props.id,
  'company,payments,createdByUser,client,orderDetails.product.productType,orderDetails.circuitReservations.client,orderDetails.treatmentReservations.client,orderDetails.treatmentReservations.employee'
);

const handleUsedPurchase = () => {
  markUsedPurchaseOrder(order.value.id, order.value.used_purchase).then( () => {
    notifySuccess('Compra canjeada ha sido actualizada');
  })
}

const handleEditNote= () => {
  editNoteOrder(order.value.id, order.value.note).then( () => {
    visibleEditNote.value = false;
    notifySuccess('La nota ha sido actualizada');
  })
}

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar venta errónea',
    message:
      '¿Está seguro que desea eliminar esta venta? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteOrder(props.id).then(() => {
        if (error.value === null) {
          notifySuccess('Registro eliminado correctamente');
          router.back();
        }
      });
    })
    .onCancel(() => {});
};
</script>

<style scoped>
.edit-payment:hover {
  cursor: pointer;
  color: darkblue;
}
</style>
