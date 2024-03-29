<template>
  <div class="row">
    <div v-if="props.editable">
      <q-btn stretch flat icon="edit" @click="showEditForm" />
      <q-btn
        stretch
        flat
        icon="delete"
        :disabled="reservation.used"
        @click="confirmDelete"
      />
    </div>
    <div class="col-grow q-ml-lg">
      <div class="row justify-between">
        <div class="col-2">
          <b>Usada: </b>{{ reservation.used ? 'Sí' : 'No' }}
          <br />
          <b>Cliente: </b>
          <RouterLink
            :to="{
              name: 'clients.show',
              params: { id: reservation.client.id },
            }"
          >
            {{ reservation.client.name }}
          </RouterLink>
        </div>
        <div class="col-4">
          <b>Fecha de reserva: </b
          >{{ FormatService.setDateFormat(reservation.date) }}
          {{ reservation.time }}
          <br />
          <b>Duración: </b> {{ reservation.duration }} min.
          <br />
          <template v-if="isCircuitReservation">
            <b>Adultos: </b>{{ reservation.adults }}
            <br />
            <b>Niños: </b>{{ reservation.children }}
          </template>
          <div v-else class="col-4">
            <b>Especialista: </b> {{ reservation.employee?.first_name }}
            {{ reservation.employee?.last_name }}
          </div>
        </div>
        <div class="col-4"><b>Nota de reserva: </b>{{ reservation.notes }}</div>
      </div>
    </div>
    <!-- :client="client" -->
    <!-- :order-detail-id="reservation.id" -->
    <CircuitReservationDialogForm
      v-model="showEditCircuitReservationForm"
      :reservation="reservation"
      @updated:success="updatedSuccess"
      @cancel="showEditCircuitReservationForm = false"
      @deleted:success="$emit('deleted:success')"
    />
    <!-- :order-detail-id="reservation.id" -->
    <TreatmentReservationDialogForm
      v-model="showEditTreatmentReservationForm"
      :client="client"
      :reservation="reservation"
      @updated:success="updatedSuccess"
      @cancel="showEditTreatmentReservationForm = false"
      @deleted:success="$emit('deleted:success')"
    />
  </div>
</template>

<script setup>
import FormatService from 'src/services/FormatService';
import { computed, ref } from 'vue';
import { useClientStore } from 'src/stores/client';
import { storeToRefs } from 'pinia';
import CircuitReservationDialogForm from './CircuitReservationDialogForm.vue';
import TreatmentReservationDialogForm from './TreatmentReservationDialogForm.vue';
import { useCircuitReservationStore } from 'src/stores/circuitReservation';
import { useTreatmentReservationStore } from 'src/stores/treatmentReservation';
import { useQuasar } from 'quasar';

const props = defineProps({
  reservation: Object,
  type: String,
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const emit = defineEmits(['updated:success', 'deleted:success']);

const $q = useQuasar();

const { client, error } = storeToRefs(useClientStore());
const { fetchClient } = useClientStore();
const { error: deleteError } = storeToRefs(useCircuitReservationStore());
const { deleteCircuitReservation } = useCircuitReservationStore();
const { deleteTreatmentReservation } = useTreatmentReservationStore();

const isCircuitReservation = computed(() => props.type === 'circuit');
const showEditCircuitReservationForm = ref(false);
const showEditTreatmentReservationForm = ref(false);

const showEditForm = async () => {
  // await fetchClient(props.reservation.client_id).then(() => {
  // if (!error.value) {
  if (isCircuitReservation.value) {
    showEditCircuitReservationForm.value = true;
  } else {
    showEditTreatmentReservationForm.value = true;
  }
  // }
  // });
};

const updatedSuccess = () => {
  showEditCircuitReservationForm.value = false;
  showEditTreatmentReservationForm.value = false;
  emit('updated:success');
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar reserva',
    message:
      '¿Está seguro que desea eliminar esta reserva? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await deleteReservation().then(() => {
        if (deleteError.value === null) {
          emit('deleted:success');
        }
      });
    })
    .onCancel(() => {});
};

const deleteReservation = async () => {
  if (isCircuitReservation.value) {
    await deleteCircuitReservation(props.reservation.id);
  } else {
    await deleteTreatmentReservation(props.reservation.id);
  }
};
</script>
