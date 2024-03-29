<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.first_name"
          label="Nombre *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <TextInput
          v-model="form.last_name"
          label="Primer Apellido *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4">
        <TextInput v-model="form.second_last_name" label="Segundo Apellido" />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.email"
          type="email"
          label="Email"
          :rules="['email']"
          required
        />
      </div>
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.phone"
          label="Teléfono"
          class="q-field--with-bottom q-mr-sm"
        />
      </div>
      <div class="col-12 col-md-2">
        <q-toggle v-model="form.is_specialist" label="Especialista" />
      </div>
      <div class="col-12 col-md-2">
        <q-toggle v-model="form.active" label="Activo" />
      </div>
    </div>
    <div>
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
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
import { useEmployeeStore } from 'stores/employee.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import TextInput from 'src/components/Form/TextInput.vue';

const props = defineProps({
  employee: Object,
});
const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { error, validationsErrors } = storeToRefs(useEmployeeStore());
const { editEmployee, storeEmployee } = useEmployeeStore();
const $q = useQuasar();
const isEditing = ref(false);
const form = reactive({
  id: props.employee?.id,
  first_name: props.employee?.first_name,
  last_name: props.employee?.last_name,
  second_last_name: props.employee?.second_last_name,
  email: props.employee?.email,
  document: props.employee?.document,
  phone: props.employee?.phone,
  active: props.employee ? props.employee.active : true,
  is_specialist: props.employee ? props.employee.is_specialist : true,
});

onMounted(() => {
  if (props.employee) {
    isEditing.value = true;
  }
});

const onSubmit = () => {
  if (isEditing.value) {
    return updateEmployee();
  }

  return createEmployee();
};

const updateEmployee = async () => {
  await editEmployee(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al editar los datos del empleado',
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

const createEmployee = async () => {
  await storeEmployee(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message:
          'Ha ocurrido un error al intentar crear el registro para el empleado',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Empleado creado correctamente',
      });

      emit('create:success');
    }
  });
};
</script>
