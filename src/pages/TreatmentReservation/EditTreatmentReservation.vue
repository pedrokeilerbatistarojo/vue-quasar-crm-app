<template>
  <SectionTitle>Editar reserva</SectionTitle>
  <p v-if="loading">Cargando datos de reserva...</p>

  <TreatmentReservationForm
    v-if="treatmentReservation"
    :reservation="treatmentReservation"
    :client="treatmentReservation.client"
    @updated:success="$router.back()"
    @deleted:success="$router.back()"
    @cancel="$router.back()"
  />
</template>

<script setup>
import { useTreatmentReservationStore } from 'src/stores/treatmentReservation';
import { storeToRefs } from 'pinia';
import TreatmentReservationForm from 'src/components/Reservation/TreatmentReservationForm.vue';
import SectionTitle from 'src/components/SectionTitle.vue';

const props = defineProps({
  id: Number,
});

const { fetchTreatmentReservation } = useTreatmentReservationStore();
const { treatmentReservation, loading } = storeToRefs(
  useTreatmentReservationStore()
);
fetchTreatmentReservation(props.id);
</script>
