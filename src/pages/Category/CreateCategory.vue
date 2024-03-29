<template>
  <div>
    <SectionTitle>Nueva categoría</SectionTitle>
    <CategoryForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import CategoryForm from "components/Category/CategoryForm.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
