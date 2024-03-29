<template>
  <q-badge
    rounded
    :style="{ 'background-color': '#0a417d' }"
    class="q-px-md q-py-xs"
  >
    Pág. {{ paginationData.page }} de {{ paginationData.totalPages }} ({{
      paginationData.rowsNumber
    }}
    registros)
  </q-badge>
  <q-btn
    v-if="paginationData.totalPages > 2"
    color="grey-8"
    round
    dense
    flat
    :disable="paginationData.page === 1"
  >
    <div v-if="paginationData.page !== 1" @click="$emit('navigateTo', 1)">
      <q-icon size="sm" name="first_page"></q-icon>
    </div>
    <q-icon v-else size="sm" name="first_page"></q-icon>
  </q-btn>

  <q-btn color="grey-8" round dense flat :disable="paginationData.page === 1">
    <div
      v-if="paginationData.page !== 1"
      @click="$emit('navigateTo', paginationData.prev)"
    >
      <q-icon size="sm" name="chevron_left"></q-icon>
    </div>
    <q-icon v-else size="sm" name="chevron_left"></q-icon>
  </q-btn>

  <q-btn
    color="grey-8"
    round
    dense
    flat
    :disable="paginationData.next === null"
  >
    <div
      v-if="paginationData.next"
      @click="$emit('navigateTo', paginationData.next)"
    >
      <q-icon size="sm" name="chevron_right"></q-icon>
    </div>
    <q-icon v-else size="sm" name="chevron_right"></q-icon>
  </q-btn>

  <q-btn
    v-if="paginationData.totalPages > 2"
    color="grey-8"
    round
    dense
    flat
    :disable="paginationData.next === null"
  >
    <div
      v-if="paginationData.page < paginationData.totalPages"
      @click="$emit('navigateTo', paginationData.totalPages)"
    >
      <q-icon size="sm" name="last_page"></q-icon>
    </div>
    <q-icon v-else size="sm" name="last_page"></q-icon>
  </q-btn>
</template>

<script setup>
defineProps({
  paginationData: Object,
});
const emit = defineEmits(['navigateTo']);
</script>
