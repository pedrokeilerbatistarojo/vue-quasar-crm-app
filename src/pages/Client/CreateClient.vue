<template>
  <div>
    <SectionTitle>Nuevo cliente</SectionTitle>
    <ClientForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import ClientForm from 'src/components/Client/ClientForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
