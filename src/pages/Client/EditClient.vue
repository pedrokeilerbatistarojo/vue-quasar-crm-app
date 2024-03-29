<template>
  <SectionTitle>Datos del cliente
  </SectionTitle>
  <q-btn
    stretch
    flat
    icon="visibility"
    :to="{ name: 'clients.show', params: { id: client.id } }"
  ><q-tooltip
    max-width="14rem"
    anchor="top middle"
    self="bottom middle"
  >
    Editar cliente
  </q-tooltip>
  </q-btn>
  <div v-if="client">
    <ClientForm
      :client="client"
      @create:success="router.back()"
      @cancel="router.back()"
    />
    <ClientNotes :client-id="client.id" :notes="client.clientNotes" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useClientStore } from 'stores/client.js';
import SectionTitle from 'src/components/SectionTitle.vue';
import ClientForm from 'src/components/Client/ClientForm.vue';
import { useRouter } from 'vue-router';
import ClientNotes from 'src/components/Client/ClientNotes.vue';

const router = useRouter();
const props = defineProps({ id: Number });
const { client, loading } = storeToRefs(useClientStore());
const { fetchClient } = useClientStore();

fetchClient(props.id);
</script>
