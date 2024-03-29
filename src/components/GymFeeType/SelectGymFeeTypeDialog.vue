<template>
  <q-dialog full-width persistent>
    <q-card style="width: 80vw; height: 80vh">
      <q-card-section>
        <SectionTitle class="block"
        >Seleccionar tipo de cuota para cliente actual</SectionTitle
        >
        <PrimaryButton label="Cancelar" @click="$emit('cancel')" />
      </q-card-section>
      <q-card-section>
        <GymFeeTypeTable class="full-width">
          <template #actions="{ gymFeeTypeId }">
            <q-btn
              stretch
              flat
              icon="how_to_reg"
              @click="selectGymFeeType(gymFeeTypeId)"
            >
              <q-tooltip
                max-width="14rem"
                anchor="top middle"
                self="bottom middle"
              >
                Seleccionar tipo de cuota
              </q-tooltip>
            </q-btn>
          </template>
        </GymFeeTypeTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useGymFeeTypeStore } from 'src/stores/GymFeeType';
import SectionTitle from '../SectionTitle.vue';
import PrimaryButton from '../Buttons/PrimaryButton.vue';
import GymFeeTypeTable from "components/GymFeeType/GymFeeTypeTable.vue";

const emit = defineEmits(['gym-fee-type:selected', 'cancel']);
const { gymFeeType } = storeToRefs(useGymFeeTypeStore());

const { fetchGymFeeType } = useGymFeeTypeStore();

const selectGymFeeType = async (gymFeeTypeId) => {
  await fetchGymFeeType(gymFeeTypeId).then(() => {
    if (gymFeeType) {
      emit('gym-fee-type:selected', gymFeeType);
    }
  });
};
</script>
