<template>
  <q-dialog persistent>
    <q-card style="width: 50vw; height: 70vh" class="q-pa-md">
      <q-card-section>
        <SectionTitle>Formulario de reserva</SectionTitle>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <CircuitReservationForm
          :client="client"
          :order-detail-id="orderDetailId"
          :reservation="reservation"
          :hide-client="hideClient"
          :pre-reservation="preReservation"
          @created:success="$emit('created:success')"
          @updated:success="$emit('updated:success')"
          @cancel="$emit('cancel')"
          @deleted:success="$emit('deleted:success')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import CircuitReservationForm from './CircuitReservationForm.vue';
import SectionTitle from 'src/components/SectionTitle.vue';

const props = defineProps({
  client: Object,
  orderDetailId: Number,
  reservation: Object,
  hideClient: Boolean,
  preReservation: Boolean,
});

defineEmits([
  'created:success',
  'updated:success',
  'cancel',
  'deleted:success',
]);
</script>
