<template>
  <SectionTitle>Ventas</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nueva venta"
    :to="{ name: 'orders.dashboard' }"
  />

  <OrderTable />
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import OrderTable from 'src/components/Order/OrderTable.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
</script>
