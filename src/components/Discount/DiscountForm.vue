<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4 col-lg-3">
        <TextInput
          v-model="form.name"
          label="Nombre *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
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
import { useDiscountStore } from 'stores/discount.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import TextInput from '../Form/TextInput.vue';

const props = defineProps({
  discount: Object,
});
const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { error, loading, validationsErrors } = storeToRefs(useDiscountStore());
const { editDiscount, storeDiscount } = useDiscountStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);
const form = reactive({
  id: props.discount?.id,
  name: props.discount?.name,
});

onMounted(() => {
  if (props.discount) {
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
  await editDiscount(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar registro');
    } else {
      notifySuccess();
      emit('update:success');
    }
  });
};

const create = async () => {
  await storeDiscount(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear registro');
    } else {
      notifySuccess('Nuevo tipo de producto creado correctamente');
      emit('create:success');
    }
  });
};
</script>
