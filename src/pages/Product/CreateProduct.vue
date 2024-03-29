<template>
  <div>
    <SectionTitle>Nuevo product</SectionTitle>
    <ProductForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import ProductForm from 'src/components/Product/ProductForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
