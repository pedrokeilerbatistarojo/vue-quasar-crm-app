<template>
  <SectionTitle>Agenda de Agua</SectionTitle>
  <q-table
    v-model:expanded="initialExpanded"
    class="circuit-reservation-table"
    :rows="ranges"
    :columns="columns"
    row-key="name"
    hide-header
    :rows-per-page-options="[0]"
    :loading="loading"
  >
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <div class="full-width row justify-center">
        <q-input
          v-model="selectedDate"
          :rules="[(v) => InputValidationService.isHumanReadableFormat(v)]"
          dense
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="selectedDate" mask="DD/MM/YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Aceptar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="q-ml-md q-pt-sm">
          <q-icon
            class="cursor-pointer"
            name="print"
            size="md"
            @click="getCircuitReservation"
            ><q-tooltip
              max-width="14rem"
              anchor="top middle"
              self="bottom middle"
            >
              Imprimir
            </q-tooltip></q-icon
          >
        </div>
      </div>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-toggle
            v-model="props.expand"
            checked-icon="add"
            unchecked-icon="remove"
          />
        </q-td>

        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div class="row justify-between">
            <div>{{ col.value }}</div>
            <div v-if="hasReservations(props.row)">
              Reservas: {{ reservations[props.row.start].length }} | Total de
              personas: {{ getTotalPersonsInRange(props.row) }}
            </div>
            <div v-else>Reservas: 0</div>
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">
            <div v-if="hasReservations(props.row)">
              <q-table
                title="Reservas"
                :rows="reservations[props.row.start]"
                :columns="reservationColumns"
                row-key="id"
                separator="cell"
                :rows-per-page-options="[0]"
                hide-pagination
              >
                <template #body-cell-id="data">
                  <q-td :auto-width="true">
                    <RouterLink
                      :to="{
                        name: 'circuit-reservations.edit',
                        params: { id: data.row.id },
                      }"
                    >
                      {{ data.row.id }}
                    </RouterLink>
                  </q-td>
                </template>
                <template #body-cell-ticket="data">
                  <q-td :auto-width="true">
                    <RouterLink
                      v-if="data.row.orderDetails"
                      :to="{
                        name: 'orders.show',
                        params: { id: data.row.orderDetails[0].order_id },
                      }"
                    >
                      {{ data.row.orderDetails[0].order.ticket_number }}
                    </RouterLink>
                  </q-td>
                </template>
                <template #body-cell-name="data">
                  <q-td :auto-width="true">
                    <q-btn
                      v-if="
                        !data.row.orderDetails ||
                        (data.row.orderDetails &&
                          data.row.orderDetails[0].order.type === 'Cliente')
                      "
                      flat
                      color="primary"
                      :label="[data.row.client.name].join(' ')"
                      :to="{
                        name: 'clients.show',
                        params: { id: data.row.client.id },
                      }"
                    />
                    <div
                      v-if="
                        data.row.orderDetails &&
                        data.row.orderDetails[0].order.type ===
                          'Venta Telefónica'
                      "
                    >
                      VT {{ data.row.orderDetails[0].order.telephone_sale_seq }}
                    </div>
                    <div
                      v-if="
                        data.row.orderDetails &&
                        data.row.orderDetails[0].order.type ===
                          'Venta de Mostrador'
                      "
                    >
                      CH {{ data.row.orderDetails[0].order.counter_sale_seq }}
                    </div>
                  </q-td>
                </template>
                <template #body-cell-phone="data">
                  <q-td :auto-width="true">
                    <q-item
                      v-if="data.row.client.phone"
                      tag="a"
                      :href="`tel:` + data.row.client.phone"
                      clickable
                    >
                      <q-item-section avatar>
                        <q-icon name="phone" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ data.row.client.phone }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-td>
                </template>
                <template #body-cell-used="data">
                  <q-td :auto-width="true">
                    <q-checkbox
                      v-model="data.row.used"
                      :disable="data.row.used"
                      keep-color
                      color="dark-blue"
                      dense
                      @update:model-value="toggleUsed(data.row)"
                    />
                  </q-td>
                </template>
                <template #body-cell-locator="data">
                  <q-td :auto-width="true">
                    <q-btn
                      v-if="data.row.orderDetails"
                      flat
                      color="primary"
                      :label="data.row.orderDetails[0].order.locator"
                      :to="{
                        name: 'orders.show',
                        params: { id: data.row.orderDetails[0].order_id },
                      }"
                    />
                  </q-td>
                </template>
                <template #bottom-row>
                  <q-tr>
                    <q-td colspan="6"> Total </q-td>
                    <q-td class="text-right">
                      {{ getAdultsInRange(props.row) }}
                    </q-td>
                    <q-td class="text-right">
                      {{ getChildrenInRange(props.row) }}
                    </q-td>
                    <q-td> </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <div v-else>No hay datos para este rango horario</div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { DateTime } from 'luxon';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import SectionTitle from 'src/components/SectionTitle.vue';
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import CircuitReservationService from '../../services/CircuitReservationService';
import InputValidationService from '../../services/InputValidationService';
import { useCircuitReservationStore } from '../../stores/circuitReservation';
import { usePdfUtils } from 'src/composables/pdfUtils';
import { useErrorNotification } from 'src/composables/errorNotification';
import { useSuccessNotification } from 'src/composables/successNotification';
import { computed } from '@vue/reactivity';

const $q = useQuasar();
const { notifyError } = useErrorNotification();
const { notifySuccess } = useSuccessNotification();

const {
  circuitReservationSummary,
  lastDateSummaryFetched,
  loading,
  error,
  schedulePdf,
} = storeToRefs(useCircuitReservationStore());
const {
  fetchCircuitReservationSummary,
  fetchSchedulePdf,
  markAsUsedCircuitReservation,
} = useCircuitReservationStore();
const { dataURItoBlob } = usePdfUtils();

const selectedDate = ref();
const ranges = ref([]);
const initialExpanded = ref([]);
const reservations = computed(() => {
  let array = [];

  for (const range of ranges.value) {
    array[range.start] = [];
    for (const reservation in circuitReservationSummary.value[range.start]) {
      array[range.start].push(
        ...circuitReservationSummary.value[range.start][reservation]
      );
    }

    if (range.deferred_entry) {
      for (const reservation in circuitReservationSummary.value[
        range.deferred_entry
      ]) {
        array[range.start].push(
          ...circuitReservationSummary.value[range.deferred_entry][reservation]
        );
      }
    }
  }

  return array;
});

watch(selectedDate, async (selectedDate) => {
  if (InputValidationService.isHumanReadableFormat(selectedDate)) {
    await fetchCircuitReservationSummary(selectedDate).then(() => {
      ranges.value = CircuitReservationService.getTimeSlots(selectedDate);
    });
  }
});

// watch(ranges, (ranges) => {
//   initialExpanded.value = ranges
//     .filter((r) => {
//       return r.start in circuitReservationSummary.value;
//     })
//     .map((r) => r.name);
// });

if (lastDateSummaryFetched.value) {
  selectedDate.value = lastDateSummaryFetched.value;
} else {
  selectedDate.value = DateTime.now().toFormat('dd/MM/yyyy');
}

const columns = [
  {},
  {
    name: 'name',
    required: true,
    label: '',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
];

const reservationColumns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id' },
  { name: 'time', align: 'center', label: 'Hora', field: 'time' },
  { name: 'ticket', align: 'center', label: 'Ticket' },
  {
    name: 'locator',
    align: 'center',
    label: 'Localizador',
  },
  { name: 'name', label: 'Nombre', field: '' },
  { name: 'phone', label: 'Teléfono', field: (row) => row.client.phone },
  { name: 'adults', label: 'Adultos', field: 'adults' },
  { name: 'children', label: 'Niños', field: 'children' },
  { name: 'used', label: 'Usado', field: 'used' },
];

const toggleUsed = (reservation) => {
  if (reservation.used) {
    $q.dialog({
      title: 'Marcar reserva como usada',
      message: '¿Está seguro que desea confirmar esta reserva como usada?',
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        markAsUsedCircuitReservation(reservation.id);
        if (error.value) {
          reservation.used = false;
          notifyError('Ha ocurrido un error al intentar editar el registro.');
        } else {
          notifySuccess('Reserva editada correctamente.');
        }
      })
      .onCancel(() => {
        reservation.used = false;
      });
  }
};

const getCircuitReservation = () => {
  fetchSchedulePdf(
    DateTime.fromFormat(selectedDate.value, 'dd/MM/yyyy').toISODate()
  )
    .then(() => {
      const blob = dataURItoBlob(schedulePdf.value.content);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    })
    .catch(() =>
      notifyError('Ha ocurrido un error al intentar descargar el PDF.')
    );
};

const hasReservations = (row) => {
  return (
    row.start in circuitReservationSummary.value ||
    (row.deferred_entry &&
      row.deferred_entry in circuitReservationSummary.value)
  );
};

const getTotalPersonsInRange = (slot) => {
  return reservations.value[slot.start]
    .map((i) => i.adults + i.children)
    .reduce((prev, curr) => prev + curr, 0);
};
const getAdultsInRange = (slot) => {
  return reservations.value[slot.start]
    .map((i) => i.adults)
    .reduce((prev, curr) => prev + curr, 0);
};
const getChildrenInRange = (slot) => {
  return reservations.value[slot.start]
    .map((i) => i.children)
    .reduce((prev, curr) => prev + curr, 0);
};
</script>
