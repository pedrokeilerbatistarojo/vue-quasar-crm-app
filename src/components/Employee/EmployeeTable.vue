<template>
  <GeneralTable
    :rows="employees"
    :columns="columns"
    :loading="loading"
    edit-route-name="employees.edit"
    :editable="editable"
    :pagination="pagination"
    @search="fetchEmployees(filters)"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-3 col-md-2">
          <q-input
            v-model="filters.id"
            clearable
            dense
            label="Código"
            @keyup.enter="fetchEmployees(filters)"
          />
        </div>
        <div class="col-4 col-md-3">
          <q-input
            v-model="filters.name"
            clearable
            dense
            label="Nombre"
            @keyup.enter="fetchEmployees(filters)"
          />
        </div>
        <div class="col-4">
          <q-input
            v-model="filters.email"
            clearable
            dense
            label="Correo electrónico"
            @keyup.enter="fetchEmployees(filters)"
          />
        </div>
        <div class="col-3">
          <q-input
            v-model="filters.phone"
            clearable
            dense
            label="Teléfono"
            @keyup.enter="fetchEmployees(filters)"
          />
        </div>
      </div>
    </template>
    <template #actions="{ clientId }">
      <slot name="actions" :client-id="clientId"></slot>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from '../../stores/employee.js';
import GeneralTable from '../../components/GeneralTable.vue';
import { reactive } from 'vue';

defineProps({
  editable: Boolean,
  viewable: Boolean,
});

const { employees, loading, error, pagination } = storeToRefs(
  useEmployeeStore()
);
const { fetchEmployees } = useEmployeeStore();
const filters = reactive({
  id: null,
  name: null,
  email: null,
  phone: null,
  document: null,
  paginate_size: 10,
});

const columns = [
  { name: 'actions' },
  { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) =>
      [row.first_name, row.last_name, row.second_last_name].join(' '),
    format: (val) => `${val}`,
    sortable: false,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Correo Electrónico',
    field: 'email',
    sortable: false,
  },
  {
    name: 'phone',
    align: 'left',
    label: 'Teléfono',
    field: 'phone',
    sortable: false,
  },
];

fetchEmployees(filters);

const navigateTo = (page) => {
  filters.page = page;
  fetchEmployees(filters);
};

const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  fetchEmployees(filters);
};
</script>
