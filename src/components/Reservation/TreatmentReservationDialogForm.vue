<template>
  <q-dialog persistent>
    <q-card style="width: 50vw; height: 50vh" class="q-pa-md">
      <q-card-section>
        <SectionTitle>Formulario de reserva</SectionTitle>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <TreatmentReservationForm
          :client="client"
          :hide-client="hideClient"
          :order-detail-id="orderDetailId"
          :reservation="reservation"
          @created:success="$emit('created:success')"
          @updated:success="$emit('updated:success')"
          @cancel="$emit('cancel');"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import TreatmentReservationForm from './TreatmentReservationForm.vue';

defineProps({
  client: Object,
  orderDetailId: {
    type: Number,
    required: false,
    default: null,
  },
  reservation: Object,
  hideClient: Boolean,
});

defineEmits(['created:success', 'updated:success', 'cancel']);
</script>
