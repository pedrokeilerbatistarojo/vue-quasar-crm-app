<template>
  <GeneralTable
    :rows="productTypes"
    :columns="ProductTypeService.getColumnsTable()"
    :loading="loading"
    :pagination="{ rowsPerPage: 1000000 }"
    selection="multiple"
    :rows-per-page-options="[0]"
    hide-bottom
    @search="fetchProductTypes(filters)"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-3">
          <q-input v-model="filters.name" clearable dense label="Nombre" />
        </div>
        <div class="col-4">
          <q-input v-model="filters.type" clearable dense label="Tipo" />
        </div>
        <div class="col-3">
          <q-input
            v-model="filters.description"
            clearable
            dense
            label="Descripción"
          />
        </div>
      </div>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductTypeStore } from '../../stores/productType';
import { reactive } from 'vue';
import GeneralTable from '../../components/GeneralTable.vue';
import ProductTypeService from 'src/services/ProductTypeService';

defineProps({
  editable: Boolean,
});

const { productTypes, loading, error, pagination } = storeToRefs(useProductTypeStore());
const { fetchProductTypes } = useProductTypeStore();

const filters = reactive({
  name: null,
  type: null,
  description: null,
  paginate_size: 1000000,
});

fetchProductTypes(filters);
</script>
