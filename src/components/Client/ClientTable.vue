<template>
  <GeneralTable
    :rows="clients"
    :columns="ClientService.getColumnsTable()"
    :loading="loading"
    edit-route-name="clients.edit"
    show-route-name="clients.show"
    :editable="editable"
    :viewable="viewable"
    :pagination="pagination"
    @search="search()"
    @navigate-to="navigateTo"
    @update:pagination="updatePagination"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-1">
          <q-input
            v-model="filters.id"
            clearable
            dense
            label="Código"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-4 col-md-3">
          <q-input
            v-model="filters.name"
            autofocus
            clearable
            dense
            label="Nombre"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-4">
          <q-input
            v-model="filters.email"
            clearable
            dense
            label="Correo electrónico"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model="filters.phone"
            clearable
            dense
            label="Teléfono"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model="filters.document"
            clearable
            dense
            label="Documento"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <DateFilter
            v-model="filters.created_at_from"
            label="Creado desde"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-3">
          <DateFilter
            v-model="filters.created_at_to"
            label="Creado hasta"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <DateFilter
            v-model="filters.updated_at_from"
            label="Actualizado desde"
            @keyup.enter="search()"
          />
        </div>
        <div class="col-12 col-md-3">
          <DateFilter
            v-model="filters.updated_at_to"
            label="Actualizado hasta"
            @keyup.enter="search()"
          />
        </div>
        <!-- <div class="col-12 col-md-3">
          <q-select
            v-model="filters.duplicate_by"
            :options="[
              {
                label: 'Teléfono',
                value: 'phone',
              },
              {
                label: 'Correo Electrónico',
                value: 'email',
              },
              {
                label: 'Documento',
                value: 'document',
              },
              {
                label: 'Nombre',
                value: 'name',
              },
            ]"
            emit-value
            map-options
            dense
            clearable
            label="Datos Coincidentes" @keyup.enter="search"
          />
        </div> -->
      </div>
    </template>
    <template #actions="{ clientId }">
      <slot name="actions" :client-id="clientId"></slot>
    </template>
  </GeneralTable>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useClientStore } from 'src/stores/client';
import GeneralTable from '../../components/GeneralTable.vue';
import {reactive, watch, ref, onMounted} from 'vue';
import DateFilter from '../Filter/DateFilter.vue';
import ClientService from 'src/services/ClientService';
import InputValidationService from 'src/services/InputValidationService';

defineProps({
  editable: Boolean,
  viewable: Boolean,
});

const emit = defineEmits(['filter:changed']);

const { clients, loading, error, pagination } = storeToRefs(useClientStore());
const { fetchClients } = useClientStore();
const filters = reactive({
  id: null,
  name: null,
  email: null,
  phone: null,
  document: null,
  created_at_from: null,
  created_at_to: null,
  updated_at_from: null,
  updated_at_to: null,
  duplicate_by: null,
});

const search = () => {
  filters.page = 1;
  const params = prepareFilters();

  fetchClients(params);
};

fetchClients(filters);

const navigateTo = (page) => {
  filters.page = page;
  const params = prepareFilters();

  fetchClients(params);
};
const updatePagination = (newPagination) => {
  filters.paginate_size = newPagination.rowsPerPage;
  const params = prepareFilters();
  fetchClients(params);
};

watch(filters, () => {
  const params = prepareFilters();
  emit('filter:changed', params);
});

const prepareFilters = () => {
  let params = { ...filters };

  if (InputValidationService.isDateSet(params.created_at_from)) {
    params.created_at_from = params.created_at_from + ' 00:00:00';
  }
  if (InputValidationService.isDateSet(params.created_at_to)) {
    params.created_at_to = params.created_at_to + ' 23:59:59';
  }

  if (InputValidationService.isDateSet(params.updated_at_from)) {
    params.updated_at_from = params.updated_at_from + ' 00:00:00';
  }
  if (InputValidationService.isDateSet(params.updated_at_to)) {
    params.updated_at_to = params.updated_at_to + ' 23:59:59';
  }

  if (params.name !== null) {
    params.sort_field = 'name';
    params.sort_type = 'ASC';
  }

  return params;
};
</script>
