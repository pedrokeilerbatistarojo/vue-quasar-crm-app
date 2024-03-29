<template>
  <GeneralTable
    :rows="gymFeeTypes"
    :columns="GymFeeTypeService.getColumnsTable()"
    :loading="loading"
    edit-route-name="gym-fee-types.edit"
    editable
    :pagination="pagination"
    @search="search"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-3">
          <q-input v-model="filters.name" clearable dense label="Nombre" @keyup.enter="search()" />
        </div>
        <div class="col-3">
          <q-input
            v-model="filters.period_type"
            clearable
            dense
            label="Período" @keyup.enter="search()"
          />
        </div>
      </div>
    </template>
    <template #actions="{ rowId }">
      <slot name="actions" :gym-fee-type-id="rowId"></slot>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useGymFeeTypeStore } from 'stores/GymFeeType';
import GeneralTable from 'src/components/GeneralTable.vue';
import { reactive } from 'vue';
import GymFeeTypeService from 'src/services/GymFeeTypeService';

const { gymFeeTypes, loading, error, pagination } = storeToRefs(
  useGymFeeTypeStore()
);
const { fetchGymFeeTypes } = useGymFeeTypeStore();

const filters = reactive({
  name: null,
  period_type: null,
  paginate_size: 10,
});

const search = () => {
  filters.page = 1;
  fetchGymFeeTypes(filters);
};

const navigateTo = (page) => {
  filters.page = page;
  fetchGymFeeTypes(filters);
};
const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  filters.page = 1;
  fetchGymFeeTypes(filters);
};
</script>
