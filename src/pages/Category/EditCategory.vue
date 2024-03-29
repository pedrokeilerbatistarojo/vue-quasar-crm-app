<template>
  <SectionTitle>Datos de la Categoría</SectionTitle>
  <p v-if="loading">Cargando datos de la Categoría...</p>
  <div v-if="category">
    <CategoryForm
      :category="category"
      @create:success="$router.back()"
      @cancel="$router.back()"
      @deleted:success="$router.back()"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCategoryStore } from 'stores/category.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import CategoryForm from 'src/components/Category/CategoryForm.vue';

const props = defineProps(
  { id: Number }
);
const { category, loading } = storeToRefs(useCategoryStore());
const { fetchCategory } = useCategoryStore();

fetchCategory(props.id);

const handle = () => {
  alert('sbdsbi')
}
</script>
