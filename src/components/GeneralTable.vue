<template>
  <q-table
    class="my-sticky-header-table"
    row-key="id"
    flat
    bordered
    :loading="loading"
    :rows-per-page-options="[3, 5, 7, 10, 20, 50]"
    :pagination="{ rowsPerPage: paginationData?.rowsPerPage || 10 }"
    @update:pagination="updatePagination"
  >
    <!-- :visible-columns="visibleColumns" -->
    <template v-if="!noHeader" #top>
      <div class="row full-width">
        <div class="col-11">
          <slot name="filters" />
        </div>
        <div class="col-1 text-right">
          <q-btn flat icon="search" class="q-mt-sm" @click="$emit('search')" />
        </div>
      </div>
    </template>

    <template #body-cell-actions="scope">
      <q-td :auto-width="true">
        <q-btn
          v-if="deleteable"
          stretch
          flat
          color="red"
          icon="delete"
          @click="handleDelete(scope.key)"
        >
          <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
            Eliminar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="editable"
          stretch
          flat
          icon="edit"
          :to="{ name: editRouteName, params: { id: scope.key } }"
        >
          <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
            Editar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="viewable"
          stretch
          flat
          icon="visibility"
          :to="{ name: showRouteName, params: { id: scope.key } }"
        >
          <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
            Ver detalles
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="emaileable"
          stretch
          flat
          icon="mail"
          @click="handleEmail(scope.key)"
        >
          <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
            Enviar por correo electrónico
          </q-tooltip>
        </q-btn>
        <slot
          name="actions"
          :client-id="scope.key"
          :row-id="scope.row.id"
          :data="scope.row"
        ></slot>
      </q-td>
    </template>
    <template #body-cell-email="scope">
      <q-td :auto-width="true">
        <q-item
          v-if="scope.row.email"
          tag="a"
          :href="`mailto:` + scope.row.email"
          clickable
        >
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.row.email }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-td>
    </template>
    <template #body-cell-phone="scope">
      <q-td :auto-width="true">
        <q-item
          v-if="scope.row.phone"
          tag="a"
          :href="`tel:` + scope.row.phone"
          clickable
        >
          <q-item-section avatar>
            <q-icon name="phone" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.row.phone }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-td>
    </template>
    <template #body-cell-locator="scope">
      <slot name="locator" :data="scope"></slot>
    </template>
    <template #body-cell-ticket="scope">
      <slot name="ticket" :data="scope"></slot>
    </template>
    <template #body-cell-client="scope">
      <q-td :auto-width="true">
        <div
          v-if="scope.row.client.id == telephoneSaleClientId"
          class="q-ml-md text-uppercase"
        >
          VT {{ scope.row.orderDetails[0].order.telephone_sale_seq }}
        </div>

        <div
          v-if="scope.row.client.id == counterSaleClientId"
          class="q-ml-md text-uppercase"
        >
          CH {{ scope.row.orderDetails[0].order.counter_sale_seq }}
        </div>

        <q-btn
          v-if="
            scope.row.client.id != counterSaleClientId &&
            scope.row.client.id != telephoneSaleClientId
          "
          flat
          color="primary"
          :label="[scope.row.client.name].join(' ')"
          :to="{ name: 'clients.show', params: { id: scope.row.client.id } }"
        />
      </q-td>
    </template>
    <template #body-cell-active="scope">
      <q-td align="center" flat>
        <q-icon
          v-if="scope.row.active"
          color="green"
          size="sm"
          name="check"
        ></q-icon>
        <q-icon
          v-if="!scope.row.active"
          color="red"
          size="sm"
          name="close"
        ></q-icon>
      </q-td>
    </template>

    <template v-if="paginationData" #pagination>
      <PaginationBanner
        :pagination-data="paginationData"
        @navigate-to="navigateTo"
      />
    </template>
  </q-table>
</template>

<script setup>
import { computed } from 'vue';
import PaginationBanner from './PaginationBanner.vue';

const props = defineProps({
  loading: Boolean,
  editable: Boolean,
  deleteable: Boolean,
  emaileable: Boolean,
  editRouteName: String,
  viewable: Boolean,
  showRouteName: String,
  pagination: Object,
  noHeader: Boolean,
  secondParam: Boolean,
});
const emit = defineEmits([
  'navigateTo',
  'search',
  'update:pagination',
  'delete',
  'mail',
]);
const paginationData = computed(() => props.pagination);
const env = import.meta.env;
const telephoneSaleClientId = env.VITE_TELEPHONE_SALE_CLIENT_ID;
const counterSaleClientId = env.VITE_COUNTER_SALE_CLIENT_ID;

const navigateTo = (page) => {
  emit('navigateTo', page);
};

const handleDelete = (key) => {
  emit('delete', key);
};

const handleEmail = (key) => {
  emit('mail', key);
};

const updatePagination = (data) => {
  emit('update:pagination', data);
};
</script>
