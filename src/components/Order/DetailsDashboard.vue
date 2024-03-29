<template>
  <q-table
    :rows="newOrder.details"
    :columns="detailsColumns"
    binary-state-sort
    hide-bottom
    :rows-per-page-options="[0]"
    row-key="product_id"
  >
    <template v-if="newOrder.details.length === 0" #top-row>
      <q-tr>
        <q-td colspan="100%">
          Lista vacía. Seleccione un producto para comenzar.
        </q-td>
      </q-tr>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td>
          <DeleteFlatButton @click="deleteDetail(props.rowIndex)" />
          <EventFlatButton @click="props.expand = !props.expand" />
        </q-td>
        <q-td key="product_name" :props="props">
          {{
            props.row.product.name.length > 40
              ? props.row.product.name.substr(0, 37) + '...'
              : props.row.product.name
          }}
          <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
            {{ props.row.product.name }}
          </q-tooltip>
        </q-td>
        <q-td key="quantity" :props="props">
          {{ props.row.quantity }}
          <q-popup-edit
            v-slot="scope"
            v-model="props.row.quantity"
            title="Cantidad"
            buttons
            persistent
          >
            <q-input v-model="scope.value" type="number" dense autofocus />
          </q-popup-edit>
        </q-td>
        <q-td key="price" :props="props">
          {{ props.row.price }}
          <q-popup-edit
            v-slot="scope"
            v-model="props.row.price"
            title="Precio unidad"
            buttons
            persistent
          >
            <q-input v-model="scope.value" type="number" dense autofocus />
          </q-popup-edit>
        </q-td>
        <q-td key="amount" :props="props">{{
            props.row.price * props.row.quantity
          }}</q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">

          <span
            v-if="!validateQuantityCircuit(props.row)"
            style="display: block; color: white; border-radius: 5px;"
            class="q-my-md q-px-sm q-py-sm bg-negative">
            La <strong>cantidad del producto</strong> no puede ser menor que la cantidad de personas en las reservas
          </span>

          <q-btn
            label="Agregar reserva +"
            :disable="!canAddReserve(props.row)"
            @click="showReservationForm(props.row)"
          />
          <q-btn
            class="q-ml-md"
            label="Enlazar pre-reserva +"
            :disable="!canAddReserve(props.row)"
            @click="selectPreReservation(props.row)"
          />
          <div v-for="reservation in props.row.reservations" :key="reservation">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="reservation.type"
                  :options="
                    ReservationService.getTypesByProduct(props.row.product)
                  "
                  emit-value
                  map-options
                  dense
                  label="Agenda"
                  @update:model-value="handleChangeReservationType(reservation, props.row.product)"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model="reservation.date"
                  type="date"
                  dense
                  label="Fecha"
                />
              </div>
              <div
                v-if="reservation.type !== 'Circuit'"
                class="col-12 col-md-3"
              >
                <TreatmentReservationHourPicker
                  v-model="reservation.time"
                  :date="reservation.date"
                  :duration="reservation.duration"
                  :employee-id="reservation.employee_id"
                  :reservation-id="reservation.id"
                />
              </div>
              <div
                v-if="reservation.type === 'Circuit'"
                class="col-12 col-md-3"
              >
                <CircuitReservationHourPicker
                  v-model="reservation.time"
                  :date="reservation.date"
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-3">
                <NumberInput
                  v-model="reservation.duration"
                  label="Duración (mins.)"
                />
              </div>
              <div
                v-if="reservation.type === 'Circuit'"
                class="col-12 col-md-3"
              >
                <NumberInput v-model="reservation.adults" label="Adultos" />
              </div>
              <div
                v-if="reservation.type === 'Circuit'"
                class="col-12 col-md-3"
              >
                <NumberInput v-model="reservation.children" label="Niños" />
              </div>
              <div
                v-if="reservation.type === 'Treatment'"
                class="col-12 col-md-6"
              >
                <EmployeeSelect
                  v-if="!loadingEmployees"
                  v-model="reservation.employee_id"
                  :options="employees"
                />
              </div>
            </div>

            <q-separator class="q-mt-sm" color="bronze" />
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <q-dialog v-model="deleteConfirmation" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="amber" text-color="white" />
        <span class="q-ml-sm"
        >¿Está seguro que desea eliminar este detalle de la orden?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancelar" color="primary" />
        <q-btn
          flat
          label="Eliminar"
          color="primary"
          @click="
            newOrder.details.splice(detailIndexToRemove, 1);
            deleteConfirmation = false;
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <SelectPreReservationDialog
    v-if="clientId"
    v-model="showPreReservationDialog"
    :client-id="clientId"
    @circuit-reservation:selected="circuitPreReservationSelected"
    @treatment-reservation:selected="treatmentPreReservationSelected"
  />
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import ReservationService from 'src/services/ReservationService';
import {useOrderStore} from 'src/stores/order';
import {onMounted, ref} from 'vue';
import NumberInput from 'src/components/Form/NumberInput.vue';
import DeleteFlatButton from 'src/components/Buttons/DeleteFlatButton.vue';
import EventFlatButton from 'src/components/Buttons/EventFlatButton.vue';
import SelectPreReservationDialog
  from '../Reservation/SelectPreReservationDialog.vue';
import EmployeeSelect from 'src/components/Form/EmployeeSelect.vue';
import {useEmployeeStore} from 'src/stores/employee';
import CircuitReservationHourPicker
  from 'src/components/Reservation/CircuitReservationHourPicker.vue';
import TreatmentReservationHourPicker
  from '../Reservation/TreatmentReservationHourPicker.vue';

defineProps({
  clientId: {
    type: Number,
    default: null,
  },
});

const {
  error: orderError,
  validationsErrors,
  newOrder,
} = storeToRefs(useOrderStore());
const { fetchEmployees } = useEmployeeStore();
const { employees, loading: loadingEmployees } = storeToRefs(
  useEmployeeStore()
);
const deleteConfirmation = ref(false);
const detailIndexToRemove = ref(null);
const showPreReservationDialog = ref(null);

const deleteDetail = (index) => {
  detailIndexToRemove.value = index;
  deleteConfirmation.value = true;
};

const validateQuantityCircuit = (currentRow) => {
  let reservationQuantity = 0
  currentRow.reservations.map(reservation => {
    if (reservation.type === 'Circuit'){
      reservationQuantity += (reservation.children + reservation.adults)
    }
  })

  if(currentRow.quantity < reservationQuantity) return false
  return true
}

onMounted(() => fetchEmployees({ is_specialist: true, paginate_size: 100 }));

const canAddReserve = (currentRow) =>
  ReservationService.getMaximumNumberOfReservations(
    currentRow.product,
    currentRow.quantity
  ) > currentRow.reservations.length;

const showReservationForm = (currentRow) => {
  currentRow.reservations.push({
    date: DateTime.now().toISODate(),
    time: null,
    type: ReservationService.getTypesByProduct(currentRow.product)[0].value,
    adults: 1,
    children: 0,
    employee_id: null,
    duration: ReservationService.getDurationByReservationType(
      ReservationService.getTypesByProduct(currentRow.product)[0].value, currentRow.product
    ),
  });
};

const selectPreReservation = (currentRow) => {
  showPreReservationDialog.value = true;

  newOrder.value.current_row_editing = currentRow;
};

const circuitPreReservationSelected = (circuitPreReservation) => {
  console.log(circuitPreReservation.value.date);
  console.log(newOrder.value.current_row_editing.line_id);
  newOrder.value.details[
    newOrder.value.current_row_editing.line_id
    ].reservations.push({
    id: circuitPreReservation.value.id,
    type: 'Circuit',
    date: circuitPreReservation.value.date,
    time: circuitPreReservation.value.time,
    adults: circuitPreReservation.value.adults,
    children: circuitPreReservation.value.children,
    duration: circuitPreReservation.value.duration,
  });
  showPreReservationDialog.value = false;
};

const treatmentPreReservationSelected = (treatmentPreReservation) => {
  console.log(treatmentPreReservation.value.date);
  console.log(newOrder.value.current_row_editing.line_id);
  newOrder.value.details[
    newOrder.value.current_row_editing.line_id
    ].reservations.push({
    id: treatmentPreReservation.value.id,
    type: 'Treatment',
    date: treatmentPreReservation.value.date,
    time: treatmentPreReservation.value.time,
    employee: treatmentPreReservation.value.employee_id,
    duration: treatmentPreReservation.value.duration,
  });
  showPreReservationDialog.value = false;
};

const handleChangeReservationType = (reservation, product) => {
  reservation.duration = ReservationService.getDurationByReservationType(reservation.type, product);
}

const detailsColumns = [
  { name: 'action' },
  { name: 'product_name', align: 'left', label: 'Producto', sortable: false },
  {
    name: 'quantity',
    align: 'left',
    label: 'Cantidad',
    field: 'quantity',
    sortable: false,
  },
  { name: 'price', align: 'left', label: 'Precio', sortable: false },
  { name: 'amount', align: 'left', label: 'Importe', sortable: false },
];
</script>
