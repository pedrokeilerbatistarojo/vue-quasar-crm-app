<template>
  <div>
    <SectionTitle>Nuevo cliente</SectionTitle>
    <UserForm @create:success="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import UserForm from 'src/components/User/UserForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
