<template>
  <div>
    <SectionTitle>Nuevo tipo de producto</SectionTitle>
    <ProductTypeForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import ProductTypeForm from 'src/components/ProductType/ProductTypeForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
