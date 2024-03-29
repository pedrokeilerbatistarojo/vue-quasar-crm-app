<template>
  <SectionTitle>Datos del Empleado</SectionTitle>
  <p v-if="loading">Cargando datos del Empleado...</p>
  <div v-if="!loading && employee">
    <EmployeeForm
      :employee="employee"
      @create:success="router.back()"
      @cancel="router.back()"
    />
    <br /><br />
    <SectionTitle>Períodos no disponibles</SectionTitle>
    <PrimaryButton
      class="float-right q-mt-lg"
      label="Nuevo periodo no disponible"
      :to="{
        name: 'employeesTimeOff.create',
        params: { employee: employee.id },
      }"
    />
    <EmployeeTimeOffTable editable deleteable :employee="employee" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from 'stores/employee.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import EmployeeForm from 'src/components/Employee/EmployeeForm.vue';
import { useRouter } from 'vue-router';
import EmployeeTimeOffTable from 'src/components/Employee/EmployeeTimeOffTable.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';

const router = useRouter();
const props = defineProps({ id: Number });
const { employee, loading } = storeToRefs(useEmployeeStore());
const { fetchEmployee } = useEmployeeStore();

fetchEmployee(props.id);
</script>
