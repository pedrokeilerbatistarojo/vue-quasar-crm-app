<template>
  <q-dialog persistent>
    <q-card style="width: 60vw; height: 80vh">
      <q-card-section>
        <SectionTitle>Seleccionar descuento para venta actual</SectionTitle>
        <PrimaryButton
          label="Venta sin descuento"
          @click="$emit('discount:unset')"
        />
      </q-card-section>
      <q-card-section class="row items-center">
        <DiscountTable class="full-width">
          <template #actions="{ discount }">
            <q-btn
              stretch
              flat
              icon="task_alt"
              @click="$emit('discount:selected', discount)"
            />
          </template>
        </DiscountTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import DiscountTable from 'src/components/Discount/DiscountTable.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from '../Buttons/PrimaryButton.vue';

const emit = defineEmits(['discount:selected', 'discount:unset']);
</script>
