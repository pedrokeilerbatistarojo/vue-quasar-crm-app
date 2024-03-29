<template>
  <GeneralTable
    :rows="employeesTimeOff"
    :columns="columns"
    :loading="loading"
    edit-route-name="employeesTimeOff.edit"
    :editable="editable"
    :deleteable="deleteable"
    :pagination="pagination"
    @search="fetchEmployeesTimeOff(filters)"
    @delete="handleDeleteEmployeeTimeOff"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-3">
          <q-input
            v-model="filters.type"
            clearable
            dense
            label="Tipo"
            @keyup.enter="fetchEmployeesTimeOff(filters)"
          />
        </div>
        <div class="col-4">
          <DateFilter
            v-model="filters.from_date"
            label="Desde"
            @keyup.enter="fetchEmployeesTimeOff(filters)"
          />
        </div>
        <div class="col-3">
          <DateFilter
            v-model="filters.to_date"
            label="Hasta"
            @keyup.enter="fetchEmployeesTimeOff(filters)"
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
import { useEmployeeTimeOffStore } from 'stores/employeeTimeOff';
import GeneralTable from '../../components/GeneralTable.vue';
import { reactive } from 'vue';
import FormatService from "src/services/FormatService";
import DateFilter from 'src/components/Filter/DateFilter.vue';
import {useQuasar} from "quasar";

const props = defineProps({
  employee: Object,
  editable: Boolean,
  deleteable:Boolean,
  viewable: Boolean,
});

const $q = useQuasar();

const { employeesTimeOff, loading, error, pagination } = storeToRefs(
  useEmployeeTimeOffStore()
);
const { fetchEmployeesTimeOff, deleteEmployeeTimeOff } = useEmployeeTimeOffStore();
const filters = reactive({
  id: null,
  employee_id: props.employee?.id,
  type: null,
  from_date: null,
  to_date: null,
  paginate_size: 10,
});

const handleDeleteEmployeeTimeOff = (id) => {
  $q.dialog({
    title: 'Eliminar',
    message:
      '¿Está seguro que desea eliminar este registro? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteEmployeeTimeOff(id).then(() => {
        if (error.value === null) {
          fetchEmployeesTimeOff(filters);
        }
      });
    })
    .onCancel(() => {});

}

const columns = [
  { name: 'actions' },
  { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
  {
    name: 'type',
    align: 'left',
    label: 'Tipo',
    field: 'type',
    sortable: false,
  },
  {
    name: 'from_date',
    align: 'left',
    label: 'Desde',
    field: (row) => FormatService.setFullDateFormat(row.from_date),
    sortable: false,
  },
  {
    name: 'to_date',
    align: 'left',
    label: 'Desde',
    field: (row) => FormatService.setFullDateFormat(row.to_date),
    sortable: false,
  },
];

fetchEmployeesTimeOff(filters);

const navigateTo = (page) => {
  filters.page = page;
  fetchEmployeesTimeOff(filters);
};

const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  fetchEmployeesTimeOff(filters);
};
</script>
