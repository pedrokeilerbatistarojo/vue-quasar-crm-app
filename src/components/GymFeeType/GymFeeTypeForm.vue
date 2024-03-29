<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-select
          v-model="form.period_type"
          dense
          :options="period_types"
          label="Período *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <TextInput
          v-model="form.name"
          label="Nombre *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <TextInput
          v-model="form.price"
          label="Precio *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <NumberInput
          v-model="form.duration_number_of_days"
          label="Días de duración *"
        />
      </div>
<!--      <div class="col-12 col-sm-6 col-md-3 col-lg-3">-->
<!--        <NumberInput-->
<!--          v-model="form.payment_day"-->
<!--          label="Día de pago *"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="col-12 col-sm-6 col-md-3 col-lg-3">-->
<!--        <NumberInput-->
<!--          v-model="form.biweekly_payment_day"-->
<!--          label="Día de pago quincenal"-->
<!--        />-->
<!--      </div>-->
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.unlimited_access"
          label="Ilimitado"
          @click="handleClickUnlimitedAccess"
        />
      </div>
    </div>
    <div v-show="isVisible" class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-input
          v-model="form.hour_from"
          label="Hora inicio *"
          dense type="time"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-input
          v-model="form.hour_to"
          label="Hora fin *"
          dense type="time"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div v-show="isVisible" class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.monday_access"
          label="Acceso Lunes *"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.tuesday_access"
          label="Acceso Martes *"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.wednesday_access"
          label="Acceso Miércoles *"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.thursday_access"
          label="Acceso Jueves *"
        />
      </div>
    </div>
    <div v-show="isVisible" class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.friday_access"
          label="Acceso Viernes *"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.saturday_access"
          label="Acceso Sábado *"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 col-lg-3">
        <q-toggle
          v-model="form.sunday_access"
          label="Acceso Domingo *"
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
</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import {onMounted, reactive, ref, watch} from 'vue';
import { useGymFeeTypeStore } from 'stores/GymFeeType.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import TextInput from '../Form/TextInput.vue';
import NumberInput from '../Form/NumberInput.vue';

const props = defineProps({
  gymFeeType: Object,
});
const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { error, loading, validationsErrors } = storeToRefs(
  useGymFeeTypeStore()
);
const { editGymFeeType, storeGymFeeType } = useGymFeeTypeStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);
const form = reactive({
  id: props.gymFeeType?.id,
  period_type: props.gymFeeType?.period_type,
  name: props.gymFeeType?.name,
  price: props.gymFeeType?.price,
  payment_day: props.gymFeeType?.payment_day,
  biweekly_payment_day: props.gymFeeType?.biweekly_payment_day,
  hour_from: props.gymFeeType?.hour_from,
  hour_to: props.gymFeeType?.hour_to,
  monday_access: props.gymFeeType?.monday_access,
  tuesday_access: props.gymFeeType?.tuesday_access,
  wednesday_access: props.gymFeeType?.wednesday_access,
  thursday_access: props.gymFeeType?.thursday_access,
  friday_access: props.gymFeeType?.friday_access,
  saturday_access: props.gymFeeType?.saturday_access,
  sunday_access: props.gymFeeType?.sunday_access,
  unlimited_access: props.gymFeeType?.unlimited_access,
  duration_number_of_days: props.gymFeeType?.duration_number_of_days,
});

const isVisible = ref(true);

const period_types = [
  'quincenal',
  'mensual',
  'trimestral',
  'semestral',
  'anual',
];

onMounted(() => {
  if (props.gymFeeType) {
    isEditing.value = true;
  }
});

const onSubmit = () => {
  if (isEditing.value) {
    return update();
  }

  return create();
};

const update = async () => {
  await editGymFeeType(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar registro');
    } else {
      notifySuccess();
      emit('update:success');
    }
  });
};

const create = async () => {
  await storeGymFeeType(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear registro');
    } else {
      notifySuccess('Nuevo tipo de cuota creada correctamente');
      emit('create:success');
    }
  });
};

const handleClickUnlimitedAccess = () => {
  if (form.unlimited_access){
    isVisible.value = false
    form.hour_to = '23:59'
    form.hour_from = '00:00'
    setValueWeekDays(false)
  }else{
    isVisible.value = true
    form.hour_to = props.gymFeeType?.hour_to ? props.gymFeeType?.hour_to : null
    form.hour_from = props.gymFeeType?.hour_from ? props.gymFeeType?.hour_from : null
  }
}

const setValueWeekDays = (value) => {
  form.monday_access = value
  form.tuesday_access = value
  form.wednesday_access = value
  form.thursday_access = value
  form.friday_access = value
  form.saturday_access = value
  form.sunday_access = value
}

</script>
