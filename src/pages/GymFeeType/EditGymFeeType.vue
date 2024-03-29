<template>
  <SectionTitle>Datos del tipo de cuota</SectionTitle>
  <p v-if="loading">Cargando datos del tipo de cuota...</p>
  <div v-if="!loading && gymFeeType">
    <GymFeeTypeForm
      :gym-fee-type="gymFeeType"
      @create:success="router.back()"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useGymFeeTypeStore } from 'stores/GymFeeType.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import GymFeeTypeForm from 'src/components/GymFeeType/GymFeeTypeForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({ id: Number });
const { gymFeeType, loading } = storeToRefs(useGymFeeTypeStore());
const { fetchGymFeeType } = useGymFeeTypeStore();

fetchGymFeeType(props.id);
</script>
