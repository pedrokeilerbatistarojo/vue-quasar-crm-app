<template>
  <SectionTitle>Tipos de cuotas</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nuevo tipo de cuota"
    :to="{ name: 'gym-fee-types.create' }"
  />
    <GymFeeTypeTable editable />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useGymFeeTypeStore } from 'stores/GymFeeType';
import SectionTitle from 'src/components/SectionTitle.vue';
import { reactive } from 'vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import GymFeeTypeTable from 'src/components/GymFeeType/GymFeeTypeTable.vue';

const { loading, error, pagination } = storeToRefs(
  useGymFeeTypeStore()
);
const { fetchGymFeeTypes } = useGymFeeTypeStore();

const filters = reactive({
  name: null,
  period_type: null,
  paginate_size: 10,
});

const search = () => {
  filters.page = 1;
  fetchGymFeeTypes(filters);
};

const navigateTo = (page) => {
  filters.page = page;
  fetchGymFeeTypes(filters);
};
const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  filters.page = 1;
  fetchGymFeeTypes(filters);
};
</script>
