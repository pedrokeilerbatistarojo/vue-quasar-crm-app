<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row">
      <div class="col-12">
        <SectionTitle>Abrir nueva caja</SectionTitle>
      </div>
      <div class="col-12">
        <TextInput
          v-model="form.session_type"
          label="Turno *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12">
        <TextInput
          v-model="form.start_amount"
          label="Cantidad inicial *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="row">
      <PrimaryButton label="Abrir caja" type="submit" />
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
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useSaleSessionStore } from 'stores/saleSession.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import TextInput from '../Form/TextInput.vue';
import SectionTitle from '../SectionTitle.vue';
import { DateTime } from 'luxon';

const emit = defineEmits(['create:success', 'cancel']);

const { error, loading, validationsErrors } = storeToRefs(
  useSaleSessionStore()
);
const { createSaleSession } = useSaleSessionStore();
const $q = useQuasar();
const form = reactive({
  session_type: DateTime.now().hour < 14 ? 'Mañana' : 'Tarde',
  start_amount: '300',
});

const onSubmit = () => {
  createSaleSession(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al intentar iniciar una sesión de venta',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Caja abierta correctamente.',
      });

      emit('create:success');
    }
  });
};
</script>
