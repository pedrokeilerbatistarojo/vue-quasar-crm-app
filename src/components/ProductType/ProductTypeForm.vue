<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4">
        <q-select
          v-model="form.category_id"
          dense
          :option-label="
            (category) =>
              category.name
          "
          :options="categories"
          emit-value
          map-options
          option-value="id"
          label="Categoría *"
          :rules="[(val) => InputValidationService.required(val)]"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Categoría no encontrado
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <TextInput
          v-model="form.name"
          label="Nombre *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4">
        <NumberInput
          v-model="form.priority"
          label="Prioridad *"
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="q-pt-lg col-12 col-md-4 flex">
        <color-picker
          v-model:pureColor="form.background_color"
          disable-alpha
          format="hex"
          shape="circle"
        />
        <span>Color de fondo *</span>
      </div>
      <div class="q-pt-lg flex col-12 col-md-4">
        <color-picker
          v-model:pureColor="form.text_color"
          disable-alpha
          format="hex"
          shape="circle"
        />
        <span>Color de texto *</span>
      </div>
      <div class="col-12 col-md-4">
        <q-toggle v-model="form.active" label="Activo" />
      </div>
    </div>
    <div class="q-pt-lg">
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
      />
      <SecondaryButton
        v-if="isEditing"
        class="q-ml-md bg-red text-white"
        label="Eliminar tipo de producto"
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
import { useProductTypeStore } from 'stores/productType.js';
import { useCategoryStore } from 'stores/category.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import TextInput from '../Form/TextInput.vue';
import NumberInput from '../Form/NumberInput.vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import {useQuasar} from "quasar";

const props = defineProps({
  productType: Object,
});
const emit = defineEmits(['create:success', 'update:success', 'deleted:success','cancel']);

const { error, loading, validationsErrors } = storeToRefs(
  useProductTypeStore()
);

const $q = useQuasar();
const { categories } = storeToRefs(useCategoryStore());
const { editProductType, storeProductType, deleteProductType } = useProductTypeStore();
const { fetchCategories } = useCategoryStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);
const form = reactive({
  id: props.productType?.id,
  category_id: props.productType?.category_id,
  name: props.productType?.name,
  priority: props.productType?.priority,
  active: props.productType?.active,
  background_color: props.productType
    ? props.productType.background_color
    : '#0A427D',
  text_color: props.productType ? props.productType.text_color : '#FFFFFF',
});

onMounted(() => {
  fetchCategories({ paginate_size: 1000000 });
  if (props.productType) {
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
  await editProductType(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar registro');
    } else {
      notifySuccess();
      emit('update:success');
    }
  });
};

const create = async () => {
  await storeProductType(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear registro');
    } else {
      notifySuccess('Nuevo tipo de producto creado correctamente');
      emit('create:success');
    }
  });
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar tipo de producto',
    message:
      '¿Está seguro que desea eliminar este tipo de producto? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteProductType(props.productType.id).then(() => {
      if (error.value === null) {
        emit('deleted:success');
      }
    });

  }).onCancel(() => {});
};
</script>
