<template>
  <div>
    <SectionTitle>Cierre de horarios</SectionTitle>
    <ClosedHourForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import ClosedHourForm from 'src/components/ClosedHour/ClosedHoursForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
