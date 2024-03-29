<template>
  <p v-if="!client">Cargando datos del cliente cliente...</p>
  <div v-else>
    <ClientDetails :client="client" />

    <GoBackSecondaryButton class="q-mt-lg" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import ClientDetails from 'src/components/Client/ClientDetails.vue';
import { useClientStore } from 'stores/client.js';
import GoBackSecondaryButton from '../../components/Buttons/GoBackSecondaryButton.vue';
import { onMounted } from 'vue';

const props = defineProps({ id: Number });
const { client } = storeToRefs(useClientStore());

const { fetchClient } = useClientStore();

onMounted(() => {
  fetchClient(props.id);
});
</script>
