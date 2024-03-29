<template>
  <GeneralTable
    :rows="duplicateList"
    :columns="ClientService.getColumnsTable()"
    :loading="loading"
    edit-route-name="clients.edit"
    show-route-name="clients.show"
    :editable="editable"
    :viewable="viewable"
    :no-header="true"
    :pagination="pagination"
    @search="search()"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #actions="{ clientId }">
      <slot name="actions" :client-id="clientId"></slot>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useClientStore } from '../../stores/client';
import GeneralTable from '../../components/GeneralTable.vue';
import { reactive, watch } from 'vue';
import DateFilter from '../Filter/DateFilter.vue';
import ClientService from 'src/services/ClientService';

defineProps({
  editable: Boolean,
  viewable: Boolean,
});

const emit = defineEmits(['filter:changed']);

const { duplicateList, loading, error, pagination } = storeToRefs(useClientStore());
const { getDuplicateList } = useClientStore();
const filters = reactive({});

const search = () => {
  filters.page = 1;

  let params = { ...filters };

  getDuplicateList(params);
};

getDuplicateList(filters);

const navigateTo = (page) => {
  filters.page = page;
  getDuplicateList(filters);
};
const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  getDuplicateList(filters);
};

watch(filters, () => emit('filter:changed', filters));
</script>
