<template>
  <div>
    <SectionTitle>Nuevo periodo no disponible</SectionTitle>
    <EmployeeTimeOffForm
      :employee="employee"
      @create:success="router.back()"
      @update:success="router.back()"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import EmployeeTimeOffForm from 'src/components/Employee/EmployeeTimeOffForm.vue';
import { useRouter } from 'vue-router';
import { useEmployeeStore } from 'src/stores/employee.js';
import { storeToRefs } from 'pinia';

const router = useRouter();
const { employee, loading } = storeToRefs(useEmployeeStore());
const { fetchEmployee } = useEmployeeStore();

const props = defineProps({
  employee: Number,
  employeeTimeOff: Number,
});

fetchEmployee(props.employee);
</script>
