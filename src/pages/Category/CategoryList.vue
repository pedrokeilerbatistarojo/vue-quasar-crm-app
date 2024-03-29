<template>
  <SectionTitle>Categorías</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nueva categoría"
    :to="{ name: 'categories.create' }"
  />
  <GeneralTable
    :rows="categories"
    :columns="CategoryService.getColumnsTable()"
    :loading="loading"
    edit-route-name="categories.edit"
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
      </div>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from 'stores/category';
import SectionTitle from 'src/components/SectionTitle.vue';
import GeneralTable from 'src/components/GeneralTable.vue';
import { reactive } from 'vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import CategoryService from 'src/services/CategoryService';

const { categories, loading, error, pagination } = storeToRefs(
  useCategoryStore()
);
const { fetchCategories } = useCategoryStore();

const filters = reactive({
  name: null,
  paginate_size: 10,
});

const search = () => {
  filters.page = 1;
  fetchCategories(filters);
};

const navigateTo = (page) => {
  filters.page = page;
  fetchCategories(filters);
};
const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  filters.page = 1;
  fetchCategories(filters);
};
</script>
