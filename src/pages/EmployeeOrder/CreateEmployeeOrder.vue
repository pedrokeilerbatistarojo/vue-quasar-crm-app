<template>
  <div>
    <SectionTitle>Ordenar especialistas</SectionTitle>
    <EmployeeOrderForm
      v-if="employeeOrder"
      :employee-order="employeeOrder"
      @create:success="router.back()"
      @update:success="router.back()"
      @deleted:success="router.back()"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import EmployeeOrderForm from 'src/components/EmployeeOrder/EmployeeOrderForm.vue';
import { useRouter } from 'vue-router';
import { useEmployeeOrderStore } from 'src/stores/employeeOrder.js';
import { storeToRefs } from 'pinia';
import {computed, ref, watch} from "vue";
import {DateTime} from "luxon";
import InputValidationService from "src/services/InputValidationService";

const router = useRouter();
const { employeesOrder, loading } = storeToRefs(useEmployeeOrderStore());
const { fetchEmployeesOrder } = useEmployeeOrderStore();
const employeeOrder = ref(null)

const props = defineProps({
  date: String,
});

fetchEmployeesOrder({date: props.date});

watch(employeesOrder, () => {
  employeeOrder.value = { date: props.date}
  if (employeesOrder.value.length > 0){
    employeeOrder.value = employeesOrder.value.find(e => e.date === props.date)
  }
});
</script>
