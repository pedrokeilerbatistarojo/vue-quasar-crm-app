<template>
  <GeneralTable
    :rows="products"
    :columns="ProductService.getColumnsTable()"
    :loading="loading"
    :pagination="{ rowsPerPage: 1000000 }"
    selection="multiple"
    :rows-per-page-options="[0]"
    hide-bottom
    @search="fetchProducts(filters)"
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
import { useProductStore } from '../../stores/product';
import { reactive } from 'vue';
import GeneralTable from '../../components/GeneralTable.vue';
import ProductService from 'src/services/ProductService';

defineProps({
  editable: Boolean,
});

const { products, loading, error, pagination } = storeToRefs(useProductStore());
const { fetchProducts } = useProductStore();

const filters = reactive({
  name: null,
  type: null,
  description: null,
  paginate_size: 1000000,
});

fetchProducts(filters);
</script>
