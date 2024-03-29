<template>
  <GeneralTable
    :rows="discounts"
    :columns="columns"
    :loading="loading"
    edit-route-name="discounts.edit"
    :editable="editable"
    :pagination="pagination"
    @search="fetchDiscounts(filters)"
    @navigate-to="navigateTo"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-3">
          <q-input v-model="filters.name" clearable dense label="Nombre" @keyup.enter="fetchDiscounts(filters)" />
        </div>
      </div>
    </template>
    <template #actions="{ data }">
      <slot name="actions" :discount="data"></slot>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useDiscountStore } from '../../stores/discount';
import GeneralTable from '../../components/GeneralTable.vue';
import { reactive } from 'vue';

defineProps({
  editable: Boolean,
  viewable: Boolean,
});

const { discounts, loading, error, pagination } = storeToRefs(
  useDiscountStore()
);
const { fetchDiscounts } = useDiscountStore();
const filters = reactive({
  id: null,
  name: null,
  email: null,
  phone: null,
  document: null,
});

const columns = [
  { name: 'actions' },
  { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: 'name',
    sortable: false,
  },
];

fetchDiscounts(filters);

const navigateTo = (page) => {
  filters.page = page;
  fetchDiscounts(filters);
};
</script>
