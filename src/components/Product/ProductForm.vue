<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-select
          v-model="form.product_type_id"
          dense
          input-debounce="0"
          label="Tipo de producto"
          :option-label="
            (productType) =>
              productType.name + ' (' + productType.category?.name + ')'
          "
          :options="productTypes"
          emit-value
          map-options
          option-value="id"
          clearable
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tipo no encontrado
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
    </div>
    <div class="row q-col-gutter-md q-mb-md">
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
    </div>
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="form.short_description"
          type="textarea"
          label="Descripción corta"
          lazy-rules
          class="q-field--with-bottom q-mr-sm"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <NumberInput
          v-model="form.price"
          label="Precio (€) *"
          :rules="[(val) => InputValidationService.isNumberNotNull(val)]"
        />
      </div>
      <div class="col-12 col-md-3">
        <NumberInput
          v-model="form.priority"
          label="Prioridad *"
          :rules="[(val) => InputValidationService.required(val)]"
          required
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <NumberInput
          v-model="form.circuit_sessions"
          label="Sesiones de agua"
          :rules="[(val) => InputValidationService.isNumberNotNull(val)]"
        />
      </div>
      <div class="col-12 col-md-3">
        <NumberInput
          v-model="form.treatment_sessions"
          label="Sesiones de tratamiento"
          :rules="[(val) => InputValidationService.isNumberNotNull(val)]"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4 col-lg-3">
        <NumberInput
          v-model="form.duration_circuit_schedule"
          label="Duración circuito en agenda de agua"
          :rules="[(val) => InputValidationService.isNumberNotNull(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <NumberInput
          v-model="form.duration_treatment_schedule"
          label="Duración del tratamiento en agenda"
          :rules="[(val) => InputValidationService.isNumberNotNull(val)]"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-md-2">
        <q-toggle v-model="form.available" label="Disponible" />
      </div>

      <div class="col-12 col-md-2">
        <q-toggle v-model="form.online_sale" label="Disponible online *" />
      </div>
      <div class="col-12 col-md-2">
        <q-toggle v-model="form.editable" label="Editable *" />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-md-2">
        <q-toggle
          v-model="form.all_reserves_on_same_day"
          label="Reservas en el mismo día *"
        />
      </div>
      <div class="col-12 col-md-2">
        <q-toggle v-model="form.active" label="Activo" />
      </div>
    </div>

    <div class="q-mt-lg">
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
      />
      <SecondaryButton
        v-if="isEditing"
        class="q-ml-md bg-red text-white"
        label="Eliminar producto"
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
import { useProductStore } from 'stores/product.js';
import { useProductTypeStore } from 'stores/productType.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import TextInput from '../Form/TextInput.vue';
import NumberInput from '../Form/NumberInput.vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits([
  'create:success',
  'update:success',
  'deleted:success',
  'cancel',
]);

const { error, loading, validationsErrors } = storeToRefs(useProductStore());
const { editProduct, storeProduct, deleteProduct } = useProductStore();
const { fetchProductTypes } = useProductTypeStore();
const { productTypes } = storeToRefs(useProductTypeStore());

const $q = useQuasar();
const isEditing = ref(false);
const form = reactive({
  id: props.product?.id,
  product_type_id: props.product?.product_type_id,
  name: props.product?.name,
  short_description: props.product?.short_description,
  price: props.product?.price,
  circuit_sessions: props.product?.circuit_sessions,
  treatment_sessions: props.product?.treatment_sessions,
  available: props.product ? props.product.available : true,
  priority: props.product?.priority,
  active: props.product?.active,
  price_type: 'Fijo',
  online_sale: props.product ? props.product.online_sale : true,
  editable: props.product ? props.product.editable : true,
  all_reserves_on_same_day: props.product
    ? props.product.all_reserves_on_same_day
    : false,
  duration_treatment_schedule: props.product?.duration_treatment_schedule,
  duration_circuit_schedule: props.product?.duration_circuit_schedule,
  background_color: props.product ? props.product.background_color : '#FFFFFF',
  text_color: props.product ? props.product.text_color : '#000000',
});

onMounted(() => {
  fetchProductTypes({ paginate_size: 1000000 });

  if (props.product) {
    isEditing.value = true;
  }
});

const onSubmit = () => {
  if (isEditing.value) {
    return updateProduct();
  }

  return createProduct();
};

const updateProduct = () => {
  editProduct(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al editar los datos del producto',
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

const createProduct = async () => {
  await storeProduct(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message:
          'Ha ocurrido un error al intentar crear el registro para el producto',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Producto creado correctamente',
      });

      emit('create:success');
    }
  });
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar producto',
    message:
      '¿Está seguro que desea eliminar este producto? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteProduct(props.product.id).then(() => {
        if (error.value === null) {
          emit('deleted:success');
        }
      });
    })
    .onCancel(() => {});
};
</script>
