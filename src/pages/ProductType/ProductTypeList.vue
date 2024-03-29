<template>
  <SectionTitle>Tipos de productos</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nuevo tipo de producto"
    :to="{ name: 'product-types.create' }"
  />
  <GeneralTable
    :rows="productTypes"
    :columns="ProductTypeService.getColumnsTable()"
    :loading="loading"
    edit-route-name="product-types.edit"
    editable
    :pagination="pagination"
    @search="search"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4 col-md-3">
          <q-input
            v-model="filters.name"
            clearable
            dense
            label="Nombre"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-3">
          <q-select
            v-model="filters.category"
            dense
            :option-label="(category) => category.name"
            :options="categories"
            label="Categoría"
            map-options
            option-value="id"
            @keyup.enter="search()"
          />
        </div>
      </div>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductTypeStore } from 'stores/productType.js';
import { useCategoryStore } from 'stores/category.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import GeneralTable from 'src/components/GeneralTable.vue';
import { onMounted, reactive } from 'vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import ProductTypeService from 'src/services/ProductTypeService';

const { productTypes, loading, error, pagination } = storeToRefs(
  useProductTypeStore()
);
const { categories } = storeToRefs(useCategoryStore());
const { fetchCategories } = useCategoryStore();
const { fetchProductTypes } = useProductTypeStore();

const filters = reactive({
  name: null,
  category_id: null,
  paginate_size: 10,
  sort_field: 'priority',
  sort_type: 'ASC',
});

onMounted(() => {
  fetchCategories({ paginate_size: 1000000 });
});

const search = () => {
  filters.category_id = filters.category?.id;
  filters.page = 1;
  fetchProductTypes(filters);
};

const navigateTo = (page) => {
  filters.page = page;
  fetchProductTypes(filters);
};
const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  filters.page = 1;
  fetchProductTypes(filters);
};
</script>
