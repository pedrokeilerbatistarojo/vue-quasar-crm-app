<template>
  <SectionTitle>Datos del periodo no disponible</SectionTitle>
  <p v-if="loading">Cargando datos de periodo no disponible...</p>
  <div v-if="!loading && employeeTimeOff">
    <EmployeeTimeOffForm
      :employee="employee"
      :employee-time-off="employeeTimeOff"
      @update:success="router.back()"
      @create:success="router.back()"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEmployeeTimeOffStore } from 'src/stores/employeeTimeOff';
import { useEmployeeStore } from 'src/stores/employee';
import SectionTitle from 'src/components/SectionTitle.vue';
import EmployeeTimeOffForm from 'src/components/Employee/EmployeeTimeOffForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  id: Number,
});

const { employee } = storeToRefs(useEmployeeStore());
const { fetchEmployee } = useEmployeeStore();
const { employeeTimeOff, loading, error } = storeToRefs(
  useEmployeeTimeOffStore()
);
const { fetchEmployeeTimeOff } = useEmployeeTimeOffStore();

fetchEmployeeTimeOff(props.id).then(() => {
  if (!error.value) {
    fetchEmployee(employeeTimeOff.value.employee_id);
  }
});
</script>
