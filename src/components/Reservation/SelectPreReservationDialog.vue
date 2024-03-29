<template>
  <q-dialog full-width>
    <q-card style="width: 80vw; height: 80vh">
      <q-card-section class="row items-center">
        <div class="col-12">
          <SectionTitle>Reservas de Circuito</SectionTitle>
        </div>
        <div class="col-12">
          <GeneralTable
            :rows="circuitReservations"
            :columns="columns"
            :loading="circuitsLoading"
            no-header
            hide-bottom
          >
            <template #actions="{ rowId }">
              <q-btn
                stretch
                flat
                icon="event_available"
                @click="selectReservation(rowId, 'circuit')"
              />
            </template>
          </GeneralTable>
        </div>
      </q-card-section>
      <q-card-section class="row items-center">
        <div class="col-12">
          <SectionTitle>Reservas de Tratamientos</SectionTitle>
        </div>
        <div class="col-12">
          <GeneralTable
            :rows="treatmentReservations"
            :columns="columns"
            :loading="treatmentLoading"
            no-header
            hide-bottom
          >
            <template #actions="{ rowId }">
              <q-btn
                stretch
                flat
                icon="how_to_reg"
                @click="selectReservation(rowId, 'treatment')"
              />
            </template>
          </GeneralTable>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import GeneralTable from '../GeneralTable.vue';
import { useCircuitReservationStore } from 'src/stores/circuitReservation';
import { useTreatmentReservationStore } from 'src/stores/treatmentReservation';
import SectionTitle from 'src/components/SectionTitle.vue';
import FormatService from 'src/services/FormatService';
import { onMounted } from 'vue';

const props = defineProps({
  clientId: Number,
});

const emit = defineEmits([
  'circuit-reservation:selected',
  'treatment-reservation:selected',
]);
const {
  circuitReservations,
  circuitReservation,
  loading: circuitsLoading,
} = storeToRefs(useCircuitReservationStore());
const {
  treatmentReservations,
  treatmentReservation,
  loading: treatmentLoading,
} = storeToRefs(useTreatmentReservationStore());

const { fetchCircuitReservations, fetchCircuitReservation } =
  useCircuitReservationStore();
const { fetchTreatmentReservations, fetchTreatmentReservation } =
  useTreatmentReservationStore();

const selectReservation = async (reservationId, type) => {
  if (type === 'circuit') {
    await fetchCircuitReservation(reservationId).then(() => {
      if (circuitReservation) {
        emit('circuit-reservation:selected', circuitReservation);
      }
    });
  } else {
    await fetchTreatmentReservation(reservationId).then(() => {
      if (treatmentReservation) {
        emit('treatment-reservation:selected', treatmentReservation);
      }
    });
  }
};

onMounted(() => {
  fetchCircuitReservations({ client_id: props.clientId });
  fetchTreatmentReservations({ client_id: props.clientId });
});

const columns = [
  {
    name: 'actions',
  },
  {
    name: 'client',
    align: 'left',
    label: 'Nombre cliente',
    field: (row) => row.client.name,
  },
  {
    name: 'date',
    label: 'Fecha',
    align: 'left',
    field: (row) => FormatService.setDateFormat(row.date),
  },
  {
    name: 'time',
    label: 'Hora',
    align: 'left',
    field: 'time',
  },
  {
    name: 'duration',
    label: 'Duración (mins.)',
    align: 'left',
    field: 'duration',
  },
  {
    name: 'notes',
    label: 'Notas',
    align: 'left',
    field: 'notes',
  },
  {
    name: 'created_at',
    label: 'Creada en',
    align: 'left',
    field: (row) => FormatService.setFullDateFormat(row.created_at),
  },
];
</script>
