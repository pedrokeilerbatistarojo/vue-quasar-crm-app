<template>
  <SectionTitle>Empleados</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nuevo empleado"
    :to="{ name: 'employees.create' }"
  />
  <EmployeeTable editable viewable />
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import EmployeeTable from 'src/components/Employee/EmployeeTable.vue';
</script>
