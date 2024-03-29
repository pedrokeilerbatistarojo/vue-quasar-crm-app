<template>
  <SectionTitle>Agenda de Tratamientos por especialista</SectionTitle>
  <div class="full-width row justify-between">
    <div class="q-mt-sm">
      <PrimaryButton
        label="Todos"
        :to="{ name: 'treatment-reservations.schedule' }"
      />
    </div>
    <EmployeeSelect
      v-if="!loadingEmployees"
      v-model="selectedEmployee.id"
      :options="employees"
    />
    <q-input
      v-model="selectedDate"
      dense
      :rules="[(v) => InputValidationService.isHumanReadableFormat(v)]"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDate" mask="DD/MM/YYYY">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Aceptar" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-icon
      class="cursor-pointer"
      name="print"
      style="color: #c8a14d;"
      size="md"
      @click="printEmployeeSchedule"
    >
      <q-tooltip
        max-width="14rem"
        anchor="top middle"
        self="bottom middle"
      >
        Imprimir
      </q-tooltip>
    </q-icon>
    <q-select
      v-model="selectedView"
      label="Vista"
      outlined
      dense
      options-dense
      :options="[
        {
          label: 'Diaria',
          value: 'day',
        },
        {
          label: 'Semanal',
          value: 'week',
        },
      ]"
      class="button"
      map-options
      emit-value
      style="min-width: 180px"
    />
  </div>
  <div v-if="selectedEmployee.id" class="row justify-center">
    <div style="display: flex; width: 100%; height: 65vh">
      <CalendarEmployee
        :key="calendarKey"
        :selected-date="selectedDate"
        :employee-id="id"
        :selected-view="selectedView"
        @updated:success="forceRerender"
      />
    </div>
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import { onMounted, ref, reactive, watch } from 'vue';
import InputValidationService from 'src/services/InputValidationService';
import { DateTime } from 'luxon';
import CalendarEmployee from 'src/components/Reservation/CalendarEmployee.vue';
import { useEmployeeStore } from 'src/stores/employee';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import EmployeeSelect from 'src/components/Form/EmployeeSelect.vue';
import { usePdfUtils } from 'src/composables/pdfUtils';

const router = useRouter();
const props = defineProps({ id: Number });
const selectedView = ref('day');
const { dataURItoBlob } = usePdfUtils();


const { fetchEmployees, fetchEmployeeSchedulePdf } = useEmployeeStore();
const { employees, schedulePdf,loading: loadingEmployees } = storeToRefs(
  useEmployeeStore()
);
const selectedDate = ref(DateTime.now().toFormat('dd/MM/yyyy'));
const selectedEmployee = reactive({
  id: props.id,
});
watch(
  () => selectedEmployee.id,
  () => {
    router.push({
      name: 'treatment-reservations.by-employee',
      params: { id: selectedEmployee.id },
    });
  }
);

fetchEmployees({ is_specialist: true, paginate_size: 100 });

onMounted(() => {
  // fetchTreatmentReservations({ employee_id: props.id });
});

const calendarKey = ref(0);

const forceRerender = () => {
  calendarKey.value += 1;
};

const printEmployeeSchedule = () => {
  fetchEmployeeSchedulePdf(
    selectedEmployee.id,
    DateTime.fromFormat(selectedDate.value, 'dd/MM/yyyy').toISODate()
  )
    .then(() => {
      const blob = dataURItoBlob(schedulePdf.value.content);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    })
    .catch(() =>
      notifyError('Ha ocurrido un error al intentar descargar el PDF.')
    );
}
</script>
