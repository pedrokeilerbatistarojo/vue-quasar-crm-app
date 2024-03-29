<template>
  <SectionTitle>Productos</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nuevo producto"
    :to="{ name: 'products.create' }"
  />
  <ProductTable editable />
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import ProductTable from 'src/components/Product/ProductTable.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
</script>
