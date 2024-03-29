<template>
  <div>
    <SectionTitle>Nuevo tipo de cuota</SectionTitle>
    <GymFeeTypeForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import GymFeeTypeForm from 'src/components/GymFeeType/GymFeeTypeForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
