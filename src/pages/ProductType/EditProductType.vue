<template>
  <SectionTitle>Datos del tipo de producto</SectionTitle>
  <p v-if="loading">Cargando datos del tipo de producto...</p>
  <div v-if="productType">
    <ProductTypeForm
      :product-type="productType"
      @create:success="router.back()"
      @cancel="router.back()"
      @deleted:success="$router.back()"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductTypeStore } from 'stores/productType.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import ProductTypeForm from 'src/components/ProductType/ProductTypeForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({ id: Number });
const { productType, loading } = storeToRefs(useProductTypeStore());
const { fetchProductType } = useProductTypeStore();

fetchProductType(props.id);
</script>
