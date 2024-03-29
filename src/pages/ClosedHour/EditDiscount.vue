<template>
  <SectionTitle>Datos del descuento</SectionTitle>
  <p v-if="loading">Cargando datos del descuento...</p>
  <div v-if="!loading && discount">
    <DiscountForm
      :discount="discount"
      @create:success="router.back()"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useDiscountStore } from 'stores/discount.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import DiscountForm from 'src/components/Discount/DiscountForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({ id: Number });
const { discount, loading } = storeToRefs(useDiscountStore());
const { fetchDiscount } = useDiscountStore();

fetchDiscount(props.id);
</script>
