<template>
  <GeneralTable
    :rows="closedHours"
    :columns="columns"
    :loading="loading"
    edit-route-name="closed-hours.edit"
    :deleteable="deleteable"
    :pagination="pagination"
    @search="fetchClosedHours(filters)"
    @navigate-to="navigateTo"
    @delete="handleDelete"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-3">
          <q-input
            v-model="filters.name"
            clearable
            dense
            label="Nombre"
            @keyup.enter="fetchClosedHours(filters)"
          />
        </div>
      </div>
    </template>
    <template #actions="{ rowId }">
      <slot name="actions" :closed-hour-id="rowId"></slot>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useClosedHourStore } from '../../stores/closedHour';
import GeneralTable from '../../components/GeneralTable.vue';
import { reactive } from 'vue';
import FormatService from 'src/services/FormatService';
import { useQuasar } from 'quasar';

defineProps({
  editable: Boolean,
  viewable: Boolean,
  deleteable: Boolean,
});

const $q = useQuasar();

const { closedHours, loading, error, pagination } = storeToRefs(
  useClosedHourStore()
);
const { fetchClosedHours, deleteClosedHour } = useClosedHourStore();
const filters = reactive({
  date: null,
});

const columns = [
  { name: 'actions' },
  {
    name: 'date',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: (row) => FormatService.setDateFormat(row.date),
    sortable: false,
  },
  {
    name: 'description',
    required: true,
    label: 'Nota',
    align: 'left',
    field: 'description',
    sortable: false,
  },
  {
    name: 'type',
    required: true,
    label: 'Tipo',
    align: 'left',
    field: 'type',
    sortable: false,
  },
  {
    name: 'closed_hours',
    required: true,
    label: 'Pases cerrados',
    align: 'left',
    field: (field) =>
      field.type !== 'Día Completo' ? field.closed_hours.join(', ') : null,
    sortable: false,
  },
];

fetchClosedHours(filters);

const navigateTo = (page) => {
  filters.page = page;
  fetchClosedHours(filters);
};

const handleDelete = (id) => {
  $q.dialog({
    title: 'Borrar registro',
    message: '¿Está seguro que desea borrar el registro?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteClosedHour(id);
      if (error) {
      }
    })
    .onCancel(() => {});
};
</script>
