<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form autocomplete="off" @submit="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.username"
          label="Nombre de usuario *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.name"
          label="Nombre *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <TextInput
          v-model="form.email"
          type="email"
          label="Correo electrónico *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="form.default_company_id"
          :options="[
            {
              label: 'Balneario Thermas de Griñon',
              value: 1,
            },
            {
              label: 'JOSÉ LUIS LÓPEZ SIMÓN',
              value: 2,
            },
          ]"
          emit-value
          map-options
          dense
          label="Empresa por defecto"
          class="q-mb-md"
          :rules="[(val) => InputValidationService.required(val)]"
        >
        </q-select>
      </div>
      <div class="col-12 col-md-4">
        <q-toggle v-model="form.active" label="Activo" />
      </div>
    </div>

    <h5 class="q-mb-none">Cambiar contraseña</h5>
    <small class="block q-mb-md"
      >Completar estos campos solo si se desea cambiar la contraseña.</small
    >
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.password"
          autocomplete="new-password"
          type="password"
          label="Contraseña *"
          :rules="getPasswordValidation()"
        />
      </div>
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.password_confirmation"
          autocomplete="new-password"
          type="password"
          label="Confirmar contraseña *"
          :rules="getPasswordValidation()"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <PrimaryButton label="Guardar" type="submit" />
        <SecondaryButton
          class="q-ml-md"
          label="Cancelar"
          @click="$emit('cancel')"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import { onMounted, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import TextInput from '../Form/TextInput.vue';

const props = defineProps({
  user: Object,
});
const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { error, validationsErrors } = storeToRefs(useUserStore());
const { editUser, storeUser } = useUserStore();
const $q = useQuasar();
const isEditing = ref(false);
const form = reactive({
  id: props.user?.id,
  username: props.user?.username,
  name: props.user?.name,
  email: props.user?.email,
  default_company_id: props.user?.default_company_id,
  password: null,
  password_confirmation: null,
  active: props.user ? props.user.active : true,
});

onMounted(() => {
  if (props.user) {
    isEditing.value = true;
  }
});

const onSubmit = () => {
  if (isEditing.value) {
    return updateUser();
  }

  return createUser();
};

const updateUser = async () => {
  await editUser(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al editar los datos del usuario',
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

const createUser = async () => {
  await storeUser(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message:
          'Ha ocurrido un error al intentar crear el registro para el usuario',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Usuario creado correctamente',
      });

      emit('create:success');
    }
  });
};

const getPasswordValidation = () =>
  isEditing.value ? [] : [(val) => InputValidationService.required(val)];
</script>
