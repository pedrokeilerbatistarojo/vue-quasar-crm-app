<template>
  <div class="row q-col-gutter-xs q-mb-lg">
    <div
      v-for="productType in productTypes"
      :key="productType.id"
      class="col-12 col-sm-4 col-md-3 col-lg-2"
    >
      <div
        class="btn-category row items-center justify-center full-height q-pa-sm shadow-1"
        :style="{
          backgroundColor: productType.background_color,
          color: productType.text_color,
        }"
        @click="showProducts(productType.id)"
      >
        <div class="text-center">
          {{ productType.name }}
        </div>
      </div>
    </div>
  </div>

  <div class="row q-col-gutter-xs q-pl-lg">
    <div
      v-for="product of productsFiltered"
      :key="product.id"
      class="col-12 col-sm-4"
    >
      <div
        class="btn-product row items-center justify-center full-height q-pa-sm shadow-1"
        :style="{ color: product.text_color, backgroundColor: product.background_color }"
        @click="$emit('productSelected', product)"
      >
        <div class="text-center">
          {{ product.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product';
import { useProductTypeStore } from 'src/stores/productType';
import { ref } from 'vue';

const { products } = storeToRefs(useProductStore());
const { productTypes, categories } = storeToRefs(useProductTypeStore());
const { fetchProducts } = useProductStore();
const { fetchProductTypes } = useProductTypeStore();

defineEmits(['productSelected']);

const productsFiltered = ref([]);
fetchProductTypes({
  paginate_size: 10000,
  sort_field: 'priority',
  sort_type: 'ASC',
});
fetchProducts({
  available: true,
  paginate_size: 1000000,
  sort_field: 'priority',
  sort_type: 'ASC',
});

const showProducts = (productTypeId) =>
  (productsFiltered.value = products.value.filter(
    (product) => product.product_type_id === productTypeId
  ));
</script>

<style lang="scss" scoped>
.btn-category:hover,
.btn-product:hover {
  cursor: pointer;
}

.btn-category {
  font-size: 12px;
  transition: all 0.3s;
}

.btn-category:hover {
  filter: brightness(115%);
  transition: all 0.3s;
}

.btn-product {
  border-radius: 0;
  text-transform: lowercase;
  text-align: left;
  padding: 4px;
  transition: all 0.3s;
}

.btn-product:hover {
  filter: brightness(115%);
  transition: all 0.3s;
}
</style>
