<template>
  <SectionTitle>Listado de descuentos</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nuevo descuento"
    :to="{ name: 'discount.create' }"
  />
  <DiscountTable editable />
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import DiscountTable from 'src/components/Discount/DiscountTable.vue';
</script>
