<template>
  <SectionTitle>Usuarios</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Nuevo usuario"
    :to="{ name: 'users.create' }"
  />
  <GeneralTable
    :rows="users"
    :columns="columns"
    :loading="loading"
    edit-route-name="users.edit"
    editable
    :pagination="pagination"
    @search="fetchUsers(filters)"
    @navigate-to="navigateTo"
  >
    <template #filters>
      <div class="row q-col-gutter-md">
        <div class="col-4">
          <q-input
            v-model="filters.email"
            clearable
            dense
            label="Correo electrónico"
            @keyup.enter="fetchUsers(filters)"
          />
        </div>
      </div>
    </template>
  </GeneralTable>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../stores/user';
import { reactive } from 'vue';
import GeneralTable from '../../components/GeneralTable.vue';

defineProps({
  editable: Boolean,
});

const { users, loading, error, pagination } = storeToRefs(useUserStore());
const { fetchUsers } = useUserStore();

const filters = reactive({
  email: null,
});

const columns = [
  { name: 'actions' },
  { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
  {
    name: 'active',
    align: 'center',
    label: 'Activo',
    field: 'active',
    sortable: false,
  },
  {
    name: 'username',
    required: true,
    label: 'Nombre de usuario',
    align: 'left',
    field: 'username',
    sortable: false,
  },
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: 'name',
    sortable: false,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Correo electrónico',
    sortable: false,
  },
];

fetchUsers();

const navigateTo = (page) => {
  filters.page = page;
  fetchUsers(filters);
};
</script>
