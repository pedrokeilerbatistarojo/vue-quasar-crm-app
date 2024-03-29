<template>
  <div>
    <SectionTitle>Nuevo descuento</SectionTitle>
    <DiscountForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import DiscountForm from 'src/components/Discount/DiscountForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
