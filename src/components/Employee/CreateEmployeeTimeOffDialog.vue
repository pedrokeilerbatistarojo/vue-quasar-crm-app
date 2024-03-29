<template>
  <q-dialog persistent>
    <q-card class="q-pa-md" style="width: 80vw">
      <q-card-section>
        <SectionTitle class="block">Periodo no disponible </SectionTitle>
      </q-card-section>
      <q-card-section>
        <EmployeeTimeOffForm
          :employee="props.employee"
          :employee-time-off="props.employeeTimeOff"
          @create:success="getEmployeeTimeOff"
          @update:success="getEmployeeTimeOff"
          @deleted:success="getEmployeeTimeOff"
          @cancel="$emit('cancel')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import SectionTitle from '../SectionTitle.vue';
import EmployeeTimeOffForm from 'src/components/Employee/EmployeeTimeOffForm.vue';

const props = defineProps({
  employeeTimeOff: Object,
});

const emit = defineEmits(['event:success', 'cancel']);

const getEmployeeTimeOff = async (eventObject) => {
  emit('event:success', eventObject);
};
</script>
