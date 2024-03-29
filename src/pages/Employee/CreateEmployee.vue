<template>
  <div>
    <SectionTitle>Nuevo empleado</SectionTitle>
    <EmployeeForm @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import EmployeeForm from 'src/components/Employee/EmployeeForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
