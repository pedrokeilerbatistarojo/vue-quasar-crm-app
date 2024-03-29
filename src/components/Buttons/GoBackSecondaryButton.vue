<template>
  <SecondaryButton label="Volver" stretch flat @click="router.back()" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import SecondaryButton from './SecondaryButton.vue';

const router = useRouter();
</script>
