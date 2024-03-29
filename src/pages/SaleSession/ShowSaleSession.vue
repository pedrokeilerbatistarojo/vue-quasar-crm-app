<template>
  <template v-if="loading">Cargando datos de caja...</template>
  <template v-else>
    <SectionTitle>Detalles de caja</SectionTitle>
    <div v-if="saleSession" class="q-mt-lg">
      <SaleSessionDetail :sale-session="saleSession" />
    </div>
  </template>
  <PrimaryButton class="q-mt-lg" label="Volver" @click="$router.back()" />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useSaleSessionStore } from 'src/stores/saleSession';
import SaleSessionDetail from 'src/components/SaleSession/SaleSessionDetail.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';

const props = defineProps({
  id: Number,
});

const { fetchSaleSession } = useSaleSessionStore();
const { saleSession, loading } = storeToRefs(useSaleSessionStore());

fetchSaleSession(props.id);
</script>
