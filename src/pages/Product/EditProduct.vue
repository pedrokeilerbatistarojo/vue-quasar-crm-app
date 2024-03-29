<template>
  <SectionTitle>Datos del producto</SectionTitle>
  <p v-if="loading">Cargando datos del producto...</p>
  <div v-if="product">
    <ProductForm
      :product="product"
      @cancel="router.back()"
      @deleted:success="$router.back()"
    />
    <q-card v-if="product.productDiscounts" class="q-my-lg">
      <q-card-section>
        <GeneralTable
          hide-bottom
          :rows="product.productDiscounts"
          :columns="columns"
          :loading="loading"
          no-header
        >
          <template #actions="{ rowId }">
            <DeleteFlatButton @click="deleteDiscount(rowId)" />
          </template>
        </GeneralTable>
      </q-card-section>
      <q-card-section
        ><PrimaryButton
          label="Agrega precio descuento"
          @click="showDiscountForm = !showDiscountForm"
        />
        <q-form v-if="showDiscountForm">
          <div class="row q-col-gutter-lg q-mt-sm">
            <div class="col-4">
              <q-select
                v-model="discountForm.discount_id"
                dense
                input-debounce="0"
                label="Tipo de producto"
                option-label="name"
                :options="availableDiscounts"
                emit-value
                map-options
                option-value="id"
                clearable
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Todos los descuentos han sido configurados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-4">
              <TextInput v-model="discountForm.price" label="Precio" />
            </div>
            <div class="col-4">
              <PrimaryButton label="Guardar" @click="createProductDiscount" />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from 'stores/product.js';
import { useDiscountStore } from 'stores/discount.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import ProductForm from 'src/components/Product/ProductForm.vue';
import { useRouter } from 'vue-router';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import TextInput from 'src/components/Form/TextInput.vue';
import { onMounted, reactive, ref, computed } from 'vue';
import GeneralTable from 'src/components/GeneralTable.vue';
import DeleteFlatButton from 'src/components/Buttons/DeleteFlatButton.vue';
import { useQuasar } from 'quasar';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';

const router = useRouter();
const props = defineProps({ id: Number });
const $q = useQuasar();
const { product, loading, error } = storeToRefs(useProductStore());
const { discounts } = storeToRefs(useDiscountStore());
const { fetchProduct, addProductDiscount, deleteProductDiscount } =
  useProductStore();
const { fetchDiscounts } = useDiscountStore();

const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();

onMounted(() => {
  fetchProduct(props.id);
  fetchDiscounts({ paginate_size: 1000000 });
});

const showDiscountForm = ref(false);

const availableDiscounts = computed(() => {
  if (!product.value || !product.value.productDiscounts) {
    return null;
  }

  let selectedDiscounts = product.value.productDiscounts.map(
    (item) => item.discount_id
  );

  return discounts.value.filter(
    (discount) => !selectedDiscounts.includes(discount.id)
  );
});

const discountForm = reactive({
  product_id: props.id,
  discount_id: null,
  price: null,
});

const createProductDiscount = () => {
  addProductDiscount(discountForm).then(() => fetchProduct(props.id));
  discountForm.discount_id = null;
  discountForm.price = null;
};

const deleteDiscount = (rowId) => {
  $q.dialog({
    title: 'Confirmar borrado',
    message: '¿Está seguro que desea eliminar esta configuración de descuento?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteProductDiscount(rowId).then(() => {
        if (error.value) {
          notifyError('Ha ocurrido un error al intentar el borrado.');
        } else {
          notifySuccess('Configuración borrada correctamente.');
          fetchProduct(props.id);
        }
      });
    })
    .onCancel(() => {});
};

const columns = [
  { name: 'actions' },
  {
    name: 'name',
    align: 'left',
    label: 'Descuento',
    field: (row) => row.discount.name,
  },
  { name: 'price', align: 'left', label: 'Precio', field: 'price' },
];
</script>
