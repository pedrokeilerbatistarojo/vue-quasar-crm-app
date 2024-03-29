<template>
  <h6>Detalles</h6>
  <q-table
    :rows="orderDetails"
    :columns="detailsColumns"
    row-key="id"
    hide-bottom
    :rows-per-page-options="[0]"
  >
    <template #body="props">
      <q-tr :props="props" class="main-row">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'product'">
            <template v-if="noLink || !props.row.product_id">
              {{ getProductNameToShow(props.row.product_name) }}
            </template>
            <template v-else>
              <RouterLink
                :to="{
                  name: 'products.edit',
                  params: { id: props.row.product_id },
                }"
                >{{ getProductNameToShow(props.row.product_name) }}
              </RouterLink>
            </template>

            <q-tooltip
              max-width="14rem"
              anchor="top middle"
              self="bottom middle"
            >
              {{ props.row.product_name }}
            </q-tooltip>
          </template>
          <template v-else-if="col.name === 'actions'">
            <DeleteFlatButton @click="deleteItem" />
          </template>
          <template v-else>
            {{ col.value }}
          </template>
        </q-td>
      </q-tr>
      <q-tr
        v-if="!hideReservations"
        :key="props.row.index"
        class="q-tr--no-hover"
        :props="props"
      >
        <q-td colspan="100%">
          <div class="text-left">
            <!-- {{
              ReservationService.getMaximumNumberOfReservations(
                props.row.product,
                props.row.quantity
              )
            }} -->
            <q-card
              v-if="
                props.row.product.circuit_sessions ||
                props.row.circuitReservations
              "
              class="q-pa-md q-ma-sm bg-card-gray"
            >
              <div class="row justify-between">
                <b>Reservas de la Agenda de Agua</b>
                <SecondaryButton
                  class="q-ml-lg q-mb-sm"
                  label="Crear reserva"
                  @click="createCircuitReservation(props.row.id)"
                />
              </div>

              <template
                v-for="reservation of props.row.circuitReservations"
                :key="reservation.id"
              >
                <ReservationCard
                  :reservation="reservation"
                  class="q-pa-sm card"
                  type="circuit"
                  @updated:success="$emit('details:updated')"
                  @deleted:success="$emit('details:updated')"
                />
                <!-- <q-separator class="q-my-sm" /> -->
              </template>
            </q-card>
            <q-card
              v-if="
                props.row.product.treatment_sessions ||
                props.row.treatmentReservations
              "
              class="q-pa-md q-mx-sm q-mb-sm bg-card-gray"
            >
              <div class="row justify-between self-center">
                <b>Reservas de Agenda de Tratamientos</b>
                <SecondaryButton
                  class="q-ml-lg q-mb-sm"
                  label="Crear reserva"
                  @click="createTreatmentReservation(props.row.id)"
                />
              </div>
              <template
                v-for="reservation of props.row.treatmentReservations"
                :key="reservation.id"
              >
                <ReservationCard
                  :reservation="reservation"
                  class="q-pa-sm card"
                  type="treatment"
                  @updated:success="$emit('details:updated')"
                  @deleted:success="$emit('details:updated')"
                />
              </template>
            </q-card>

            <!-- <pre>{{ props.row.circuitReservations }}</pre> -->
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <CircuitReservationDialogForm
    v-if="!hideReservations"
    v-model="showCircuitReservationForm"
    persistent
    :client="orderClient"
    :order-detail-id="orderDetailToReserve"
    :hide-client="hideClient"
    @created:success="circuitReservationCreated"
    @cancel="showCircuitReservationForm = false"
  />
  <TreatmentReservationDialogForm
    v-if="!hideReservations"
    v-model="showTreatmentReservationForm"
    persistent
    :client="orderClient"
    :order-detail-id="orderDetailToReserve"
    :hide-client="hideClient"
    @created:success="circuitReservationCreated"
    @cancel="showTreatmentReservationForm = false"
  />
</template>

<script setup>
import { useQuasar } from 'quasar';
import DeleteFlatButton from 'src/components/Buttons/DeleteFlatButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import TreatmentReservationDialogForm from 'src/components/Reservation/TreatmentReservationDialogForm.vue';
import FormatService from 'src/services/FormatService';
import { ref } from 'vue';
import CircuitReservationDialogForm from '../Reservation/CircuitReservationDialogForm.vue';
import ReservationCard from '../Reservation/ReservationCard.vue';

const props = defineProps({
  orderDetails: Object,
  orderClient: Object,
  hideReservations: Boolean,
  noLink: Boolean,
  hideClient: Boolean,
});
const emit = defineEmits(['details:updated']);
const $q = useQuasar();

const showCircuitReservationForm = ref(false);
const showTreatmentReservationForm = ref(false);
const orderDetailToReserve = ref(null);

const createCircuitReservation = (orderDetailId) => {
  orderDetailToReserve.value = orderDetailId;
  showCircuitReservationForm.value = true;
};
const createTreatmentReservation = (orderDetailId) => {
  orderDetailToReserve.value = orderDetailId;
  showTreatmentReservationForm.value = true;
};

const circuitReservationCreated = () => {
  showCircuitReservationForm.value = false;
  showTreatmentReservationForm.value = false;
  emit('details:updated');
};

const deleteItem = () => {
  $q.dialog({
    title: 'Eliminar detalle',
    message: '¿Está seguro que desea eliminar esta línea de la venta?',
    cancel: true,
  }).onOk(() => {
    //TODO
  });
};

const getProductNameToShow = (name) =>
  name.length > 30 ? name.substr(0, 27) + '...' : name;
const detailsColumns = [
  { name: 'actions', align: 'left', label: '', field: '' },
  { name: 'id', align: 'left', label: 'Código', field: 'id' },
  { name: 'product', align: 'left', label: 'Producto', sortable: false },
  {
    name: 'quantity',
    align: 'left',
    label: 'Cantidad',
    field: 'quantity',
    sortable: false,
  },
  {
    name: 'price',
    align: 'left',
    label: 'Precio €',
    field: (row) => FormatService.setCurrencyFormat(row.price),
    sortable: false,
  },
  {
    name: 'total',
    align: 'left',
    label: 'Total €',
    field: (row) => FormatService.setCurrencyFormat(row.price * row.quantity),
    sortable: false,
  },
];
</script>

<style scoped lang="scss">
h6 {
  margin: 1rem 0 0.5rem;
}
.card:hover {
  background-color: #eee;
}

.bg-card-gray {
  background-color: #fcfcfc;
}

tr.main-row td {
  border-bottom: none;
}
</style>
