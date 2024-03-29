<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-sm q-my-md">
      <div class="col-12 col-md-4 col-lg-3">
        <SecondaryButton
          label="Seleccionar tipo de cuota"
          @click="showGymFeeTypeSelection = true"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4 col-lg-3">
        <TextInput
          v-model="form.gym_fee_type_name"
          label="Nombre *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <TextInput
          v-model="form.price"
          label="Precio *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <q-select
          v-model="form.payment_type"
          dense
          :options="paymentTypes"
          label="Tipo de pago *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4 col-lg-3">
        <NumberInput
          v-model="form.payment_day"
          label="Día de pago *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <NumberInput
          v-model="form.biweekly_payment_day"
          label="Día de pago quincenal"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4 col-lg-3">
        <q-input
          v-model="form.activation_date"
          dense type="date"
          label="Fecha de activación *"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <q-input
          v-model="form.start_date"
          dense type="date"
          label="Fecha de inicio *"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <q-input
          v-model="form.expiration_date"
          dense type="date"
          label="Fecha de expiración *"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="q-mt-lg">
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
      />
    </div>
  </q-form>

  <SelectGymFeeTypeDialog
    v-model="showGymFeeTypeSelection"
    @gym-fee-type:selected="gymFeeTypeSelection"
    @cancel="showGymFeeTypeSelection = false"
  />

</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import {onMounted, reactive, ref, watch} from 'vue';
import { useGymSubscriptionStore } from 'stores/gymSubscription.js';
import { useGymFeeTypeStore } from 'stores/GymFeeType.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import TextInput from '../Form/TextInput.vue';
import NumberInput from '../Form/NumberInput.vue';
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";
import SelectGymFeeTypeDialog from 'src/components/GymFeeType/SelectGymFeeTypeDialog.vue';

const router = useRouter();

const props = defineProps({
  gymSubscription: Object,
  clientId: String,
});

const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { error, loading, validationsErrors } = storeToRefs(
  useGymSubscriptionStore()
);
const { gymFeeType } = storeToRefs(
  useGymFeeTypeStore()
);

const { editGymSubscription, storeGymSubscription } = useGymSubscriptionStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);
const form = reactive({
  id: props.gymSubscription?.id,
  client_id: props.gymSubscription?.client_id,
  gym_fee_type_id: props.gymSubscription?.gym_fee_type_id,
  gym_fee_type_name: props.gymSubscription?.gym_fee_type_name,
  price: props.gymSubscription?.price,
  activation_date: props.gymSubscription?.activation_date,
  start_date: props.gymSubscription?.start_date,
  expiration_date: props.gymSubscription?.expiration_date,
  payment_day: props.gymSubscription?.payment_day,
  biweekly_payment_day: props.gymSubscription?.biweekly_payment_day,
  payment_type: props.gymSubscription?.payment_type,
});

const paymentTypes = [
  'efectivo',
  'tarjeta',
  'transferencia'
]

const showGymFeeTypeSelection = ref(false);

onMounted(() => {
  if (props.gymSubscription) {
    isEditing.value = true;
  }
  form.client_id = props.clientId ?? null
});

const onSubmit = () => {
  if (isEditing.value) {
    return update();
  }

  return create();
};

const update = async () => {
  await editGymSubscription(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar registro');
    } else {
      notifySuccess();
      emit('update:success');
    }
  });
};

const create = async () => {
  await storeGymSubscription(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear registro');
    } else {
      notifySuccess('Nueva asociación creada correctamente');
      emit('create:success');
    }
  });
};

const gymFeeTypeSelection = (data) => {
  form.gym_fee_type_id = data.value.id
  form.gym_fee_type_name = data.value.name
  form.price = data.value.price
  form.payment_day = data.value.payment_day
  form.biweekly_payment_day = data.value.biweekly_payment_day
  showGymFeeTypeSelection.value = false
}

</script>
