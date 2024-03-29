<template>
  <template v-if="loading"> Cargando información de caja abierta... </template>
  <template v-else>
    <template v-if="currentSaleSession">
      <SectionTitle>Cierre de caja</SectionTitle>
      <PrimaryButton
        class="float-right q-mt-lg"
        label="Cerrar caja"
        @click="openDialog"
      />
      <SaleSessionDetail :sale-session="currentSaleSession" />
    </template>
    <template v-else> No hay ninguna caja abierta en estos momentos. </template>
  </template>

  <q-dialog v-model="showCloseDialog">
    <q-card style="width: 50vw; height: 60vh" class="q-pa-md">
      <q-card-section>
        <SectionTitle> Información de cierre </SectionTitle>
      </q-card-section>
      <q-card-section>
        <p>
          <b>Efectivo:</b>
          {{ cash }}
        </p>
        <p>
          <b>Tarjeta de Crédito:</b>
          {{ creditCard }}
        </p>
        <p>
          <b>Transferencia:</b>
          {{ transfer }}
        </p>
        <p>
          <b>Total de ventas:</b>
          {{ totalSale }}
        </p>
        <TextInput v-model="form.end_amount" label="Cantidad al cierre (€)" />
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div>
            <PrimaryButton label="Confirmar cierre" @click="close" />
          </div>
          <div>
            <SecondaryButton
              label="Cancelar cierre"
              @click="showCloseDialog = false"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import SaleSessionDetail from 'src/components/SaleSession/SaleSessionDetail.vue';
import { useSaleSessionStore } from 'stores/saleSession.js';
import { storeToRefs } from 'pinia';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import { ref, reactive, onMounted } from 'vue';
import TextInput from 'src/components/Form/TextInput.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';

const {
  error,
  loading,
  currentSaleSession,
  cash,
  transfer,
  creditCard,
  totalSale,
  totalAmount,
} = storeToRefs(useSaleSessionStore());
const { fetchCurrentSaleSession, closeSaleSession } = useSaleSessionStore();
const showCloseDialog = ref(false);

onMounted(() => {
  fetchCurrentSaleSession();
});

const form = reactive({
  id: currentSaleSession.value?.id,
  end_amount: 0,
});

const openDialog = () => {
  form.id = currentSaleSession.value.id;
  form.end_amount = totalAmount.value;
  showCloseDialog.value = true;
};

const close = () => {
  closeSaleSession(form);
  showCloseDialog.value = false;
};
</script>
