<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <div v-if="props.employee" class="row items-start q-gutter-md q-my-md">
    <q-card class="my-card col-12 col-md-6">
      <q-card-section>
        <span class="block text-h6">{{
          `${props.employee.first_name} ${props.employee.last_name}`
        }}</span>
        <span class="block">Email: {{ props.employee.email }}</span>
        <span class="block">Teléfono: {{ props.employee.phone }}</span>
        <span class="block"
          >Especialista: {{ props.employee.is_specialist ? 'Sí' : 'No' }}</span
        >
      </q-card-section>
    </q-card>
  </div>
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-select
          v-model="form.type"
          label="Tipo *"
          :options="options"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div v-if="form.type === 'Día Completo'" class="col-12">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.from_date"
              label="Desde"
              type="date"
              stack-label
            />
          </div>
          <div class="col-12 col-md-6 q-pl-md">
            <q-input
              v-model="form.to_date"
              label="Hasta"
              type="date"
              stack-label
            />
          </div>
        </div>
      </div>
      <div v-if="form.type === 'Horas'" class="col-12">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-input v-model="form.from_date" label="Desde">
              <template #prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form.from_date" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="form.from_date"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6 q-pl-md">
            <q-input v-model="form.to_date" label="Hasta">
              <template #prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form.to_date" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="form.to_date"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="row justify-between q-mt-lg">
      <div>
        <PrimaryButton label="Guardar" type="submit" />
        <SecondaryButton
          class="q-ml-md"
          label="Cancelar"
          @click="$emit('cancel')"
        />
      </div>
      <SecondaryButton
        v-if="isEditing && employeeTimeOff.id"
        class="q-ml-md bg-red text-white"
        label="Eliminar"
        @click="confirmDelete"
      />
    </div>
  </q-form>
</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import { onMounted, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useEmployeeTimeOffStore } from 'src/stores/employeeTimeOff.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';

const props = defineProps({
  employee: Object,
  employeeTimeOff: Object,
});
const emit = defineEmits([
  'create:success',
  'update:success',
  'deleted:success',
  'cancel',
]);

const { error, validationsErrors } = storeToRefs(useEmployeeTimeOffStore());
const { editEmployeeTimeOff, storeEmployeeTimeOff, deleteEmployeeTimeOff } =
  useEmployeeTimeOffStore();
const $q = useQuasar();
const isEditing = ref(false);
const form = reactive({
  id: props.employeeTimeOff?.id,
  employee_id: props.employee
    ? props.employee?.id
    : props.employeeTimeOff?.employee_id,
  type: props.employeeTimeOff?.type,
  from_date: props.employeeTimeOff?.from_date,
  to_date: props.employeeTimeOff?.to_date,
});

onMounted(() => {
  if (props.employeeTimeOff) {
    if (form.type === 'Día Completo') {
      form.from_date = formatDate(form.from_date);
      form.to_date = formatDate(form.to_date);
    }
    isEditing.value = true;
  }
});

const formatDate = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const options = ['Día Completo', 'Horas'];

const onSubmit = () => {
  if (form.type === 'Día Completo') {
    form.from_date = `${form.from_date} 00:00:00`;
    form.to_date = `${form.to_date} 23:59:59`;
  }

  if (isEditing.value) {
    return updateEmployeeTimeOff();
  } else {
    form.employee_id = props.employee?.id;
    return createEmployeeTimeOff();
  }
};

const updateEmployeeTimeOff = async () => {
  await editEmployeeTimeOff(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al editar los datos',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Cambios guardados correctamente',
      });

      emit('update:success');
    }
  });
};

const createEmployeeTimeOff = async () => {
  await storeEmployeeTimeOff(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al intentar crear el registro',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Creado correctamente',
      });

      emit('create:success');
    }
  });
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar periodo no disponible',
    message:
      '¿Está seguro que desea eliminar este periodo no disponible? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteEmployeeTimeOff(props.employeeTimeOff.id).then(() => {
        if (error.value === null) {
          emit('deleted:success');
        }
      });
    })
    .onCancel(() => {});
};
</script>
