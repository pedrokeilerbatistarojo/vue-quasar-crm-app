<template>
  <GeneralTable
    :rows="products"
    :columns="ProductService.getColumnsTable()"
    :loading="loading"
    edit-route-name="products.edit"
    editable
    :pagination="pagination"
    row-key="id"
    @search="search"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-3">
          <q-input v-model="filters.name" clearable dense label="Nombre" @keyup.enter="fetchProducts(filters)" />
        </div>
        <div class="col-4">
          <q-input v-model="filters.product_type" clearable dense label="Tipo" @keyup.enter="fetchProducts(filters)" />
        </div>
        <div class="col-3">
          <q-input
            v-model="filters.description"
            clearable
            dense
            label="Descripción" @keyup.enter="fetchProducts(filters)"
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
  product_type: null,
  description: null,
  sort_field: 'priority',
  sort_type: 'ASC',
});

fetchProducts(filters);

const search = () => {
  filters.page = 1;
  fetchProducts(filters);
};

const navigateTo = (page) => {
  filters.page = page;
  fetchProducts(filters);
};

const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  fetchProducts(filters);
};
</script>
