<template>
  <q-dialog full-width persistent>
    <q-card style="width: 80vw; height: 80vh">
      <q-card-section>
        <SectionTitle class="block"
          >Seleccionar cliente
        </SectionTitle>
        <PrimaryButton label="Cancelar" @click="$emit('cancel')" />
      </q-card-section>
      <q-card-section>
        <ClientTable class="full-width">
          <template #actions="{ clientId }">
            <q-btn
              stretch
              flat
              icon="how_to_reg"
              @click="selectClient(clientId)"
            >
              <q-tooltip
                max-width="14rem"
                anchor="top middle"
                self="bottom middle"
              >
                Seleccionar cliente
              </q-tooltip>
            </q-btn>
          </template>
        </ClientTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import ClientTable from 'src/components/Client/ClientTable.vue';
import { useClientStore } from 'src/stores/client';
import SectionTitle from '../SectionTitle.vue';
import PrimaryButton from '../Buttons/PrimaryButton.vue';

const emit = defineEmits(['client:selected', 'cancel']);
const { clientToForm } = storeToRefs(useClientStore());

const { fetchClientToForm } = useClientStore();

const selectClient = async (clientId) => {
  await fetchClientToForm(clientId).then(() => {
    if (clientToForm) {
      emit('client:selected', clientToForm);
    }
  });
};
</script>
