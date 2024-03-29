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
      <div class="col-12 col-md-4 col-lg-3">
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
      <SecondaryButton
        v-if="isEditing"
        class="q-ml-md bg-red text-white"
        label="Eliminar categoría"
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
import { useCategoryStore } from 'stores/category.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import TextInput from '../Form/TextInput.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps({
  category: Object,
});
const emit = defineEmits([
  'create:success',
  'update:success',
  'deleted:success',
  'cancel',
]);

const { error, loading, validationsErrors } = storeToRefs(useCategoryStore());
const { editCategory, storeCategory, deleteCategory } = useCategoryStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);
const form = reactive({
  id: props.category?.id,
  name: props.category?.name,
  active: props.category?.active,
});

onMounted(() => {
  if (props.category) {
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
  await editCategory(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar registro');
    } else {
      notifySuccess();
      emit('update:success');
    }
  });
};

const create = async () => {
  await storeCategory(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear registro');
    } else {
      notifySuccess('Nueva categoría creado correctamente');
      emit('create:success');
    }
  });
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar categoría',
    message:
      '¿Está seguro que desea eliminar esta categoría? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteCategory(props.category.id).then(() => {
      if (error.value === null) {
        emit('deleted:success');
      }
    });

  }).onCancel(() => {});
};
</script>
