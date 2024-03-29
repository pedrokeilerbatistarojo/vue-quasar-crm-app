<template>
  <div>
    <p v-if="loading">Cargando datos del tratamiento...</p>
    <div v-if="treatmentReservation" class="q-pa-md">
      <h4>Reserva de Tratamiento</h4>

      <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
        <div class="row">
          <q-select
            v-model="treatmentReservation.employee_id"
            filled
            use-input
            input-debounce="0"
            label="Empleado"
            :option-label="
              (employee) => [employee.first_name, employee.last_name].join(' ')
            "
            :options="employeeSelectOptions"
            style="width: 250px"
            emit-value
            map-options
            option-value="id"
            clearable
            @filter="selectFilterFn"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Empleado no encontrado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <q-separator />
        <ClientDetails :id="treatmentReservation.client_id" />
        <div>
          <q-btn label="Guardar" type="submit" color="primary" />
          <q-btn
            label="Ignorar cambios"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>

    <pre>{{ treatmentReservation }}</pre>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useTreatmentReservationStore } from 'stores/treatmentReservation';
import { useEmployeeStore } from 'src/stores/employee';
import InputValidationService from '../../services/InputValidationService';
import { onMounted, ref } from 'vue';
import ClientDetails from '../../components/Client/ClientDetails.vue';

const props = defineProps({ id: Number });
const { treatmentReservation, loading } = storeToRefs(
  useTreatmentReservationStore()
);
const { fetchTreatmentReservation } = useTreatmentReservationStore();
const { fetchEmployees } = useEmployeeStore();
const { employees } = storeToRefs(useEmployeeStore());
const $q = useQuasar();
const employeeSelectOptions = ref(employees.value);

const onSubmit = () => {
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Cambios guardados correctamente',
  });
};

const onReset = () => {
  fetchTreatmentReservation(props.id);
};

fetchTreatmentReservation(props.id);
fetchEmployees({ is_specialist: true, paginate_size: 100 });

const selectFilterFn = (val, update) => {
  if (val === '') {
    update(() => {
      employeeSelectOptions.value = employees.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    employeeSelectOptions.value = employees.value.filter(
      (v) =>
        v.first_name.toLowerCase().indexOf(needle) > -1 ||
        (v.last_name && v.last_name.toLowerCase().indexOf(needle) > -1)
    );
  });
};
</script>
