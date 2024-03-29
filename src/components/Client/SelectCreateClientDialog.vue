<template>
  <q-dialog full-width persistent>
    <q-card style="width: 80vw; height: 80vh">
      <q-card-section>
        <SectionTitle class="block"
          >Crear cliente
        </SectionTitle>
        <PrimaryButton label="Cancelar" @click="$emit('cancel')" />
      </q-card-section>
      <q-card-section>
        <div class="q-pa-md">
          <ClientForm @create:success="selectClient" @cancel="$emit('cancel')" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useClientStore } from 'src/stores/client';
import SectionTitle from '../SectionTitle.vue';
import PrimaryButton from '../Buttons/PrimaryButton.vue';
import ClientForm from './ClientForm.vue';

const emit = defineEmits(['client:selected', 'cancel']);
const { clientToForm } = storeToRefs(useClientStore());

const { fetchClientToForm } = useClientStore();

const selectClient = async (client) => {
  await fetchClientToForm(client.value.id).then(() => {
    if (clientToForm) {
      emit('client:selected', clientToForm);
    }
  });
};
</script>
