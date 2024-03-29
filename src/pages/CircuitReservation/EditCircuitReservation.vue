<template>
  <SectionTitle>Editar reserva</SectionTitle>
  <p v-if="loading">Cargando datos de reserva...</p>

  <CircuitReservationForm
    v-if="circuitReservation"
    :reservation="circuitReservation"
    :client="circuitReservation.client"
    @updated:success="$router.back()"
    @deleted:success="$router.back()"
    @cancel="$router.back()"
  />
</template>

<script setup>
import { useCircuitReservationStore } from 'src/stores/circuitReservation';
import { storeToRefs } from 'pinia';
import CircuitReservationForm from 'src/components/Reservation/CircuitReservationForm.vue';
import SectionTitle from 'src/components/SectionTitle.vue';

const props = defineProps({
  id: Number,
});

const { fetchCircuitReservation } = useCircuitReservationStore();
const { circuitReservation, loading } = storeToRefs(
  useCircuitReservationStore()
);
fetchCircuitReservation(props.id);
</script>
