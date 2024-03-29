<template>
  <SectionTitle>Clientes</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nuevo cliente"
    :to="{ name: 'clients.create' }"
  />
  <PrimaryButton
    class="float-right q-mt-lg q-mr-sm"
    label="Exportar"
    @click="exportExcel"
  />
  <ClientTable editable viewable @filter:changed="(data) => (filters = data)" />
</template>

<script setup>
import ClientTable from '../../components/Client/ClientTable.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import { useClientStore } from 'src/stores/client';
import { storeToRefs } from 'pinia';
import { useExcelUtils } from 'src/composables/excelUtils';
import { useErrorNotification } from 'src/composables/errorNotification';
import { ref } from 'vue';

const { excelList } = storeToRefs(useClientStore());
const { getExcelList } = useClientStore();
const { dataURItoBlob } = useExcelUtils();
const { notifyError } = useErrorNotification();
const filters = ref({});

const exportExcel = () => {
  let params = { ...filters.value };

  getExcelList(params)
    .then(() => {
      const blob = dataURItoBlob(excelList.value.content);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    })
    .catch((error) => {
      console.error(error);
      notifyError('Ha ocurrido un error al intentar descargar el listado.');
    });
};
</script>
