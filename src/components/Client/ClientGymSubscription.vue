<template>
  <div class="row q-mt-lg q-mb-lg">
    <div class="col-12 col-md-6 col-lg-4">
    <q-card v-if="gymSubscriptionsActiveByClient" class="my-card d-block">
      <q-card-section>
        <div class="row w-100">
          <div class="col-12">
            <div class="text-h6">Suscripción activa</div>
          </div>
          <div class="col-6">
            <div class="text-subtitle2">Código: {{ gymSubscriptionsActiveByClient.id }}</div>
            <div class="text-subtitle2">Tipo de cuota: {{ gymSubscriptionsActiveByClient.gym_fee_type_name }}</div>
            <div class="text-subtitle2">Tipo de pago: {{ gymSubscriptionsActiveByClient.payment_type }} </div>
          </div>
          <div class="col-6">
            <div class="text-subtitle2">Precio: {{ FormatService.setCurrencyFormat(gymSubscriptionsActiveByClient.price) }} </div>
            <div class="text-subtitle2">Día de pago: {{ gymSubscriptionsActiveByClient.payment_day }} </div>
            <div class="text-subtitle2">Día de pago: {{ gymSubscriptionsActiveByClient.biweekly_payment_day }} </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="left">
        <q-btn
          color="red"
          icon="cancel"
          flat
          @click="showCancelGymSubscription = true">
          <strong>DARSE DE BAJA</strong>
        </q-btn>
      </q-card-actions>
    </q-card>
    <SecondaryButton
      v-else
      class="q-mb-lg"
      label="Nueva asociación"
      :to="{
          name: 'gym-subscriptions.create',
          query: { clientId: clientId },
        }"
    />
    </div>
  </div>
  <q-separator />

  <div v-if="gymSubscriptionsActiveByClient" class="row q-mt-lg">
    <div class="col-12">
      <SecondaryButton
        label="Añadir quotas"
        :to="{
              name: 'gym-subscription-quotes.create',
              query: { gymSubscriptionId: gymSubscriptionsActiveByClient.id },
            }"
      />
      <div class="row">
        <div class="col-12">
          <SectionTitle>
            Quotas
          </SectionTitle>
          <GeneralTable
            :rows="gymSubscriptionQuotes"
            :columns="GymSubscriptionQuoteService.getColumns()"
            :loading="loading"
            :pagination="pagination"
            no-header
            deleteable
            @delete="handleDeleteQuote"
            @search="fetchGymSubscriptions(filters)"
            @navigate-to="navigateTo"
          >
          </GeneralTable>
        </div>
      </div>
    </div>
  </div>

  <q-separator />

  <div v-if="gymSubscriptionsActiveByClient" class="row q-mt-lg">
    <div class="col-12">
      <SecondaryButton
        label="Añadir beneficiarios"
        :to="{
              name: 'gym-subscription-members.create',
              query: { gymSubscriptionId: gymSubscriptionsActiveByClient.id },
            }"
      />
      <div class="row">
        <div class="col-12">
          <SectionTitle>
            Beneficiarios
          </SectionTitle>
          <GeneralTable
            :rows="gymSubscriptionMembers"
            :columns="GymSubscriptionMemberService.getColumns()"
            :loading="loading"
            :pagination="pagination"
            no-header
            @search="fetchGymSubscriptions(filters)"
            @navigate-to="navigateTo"
          >
          </GeneralTable>
        </div>
      </div>
    </div>
  </div>

  <q-separator />

  <div class="row q-mt-md">
    <div class="col-12">
      <SectionTitle>
        Historial de suscripciones
      </SectionTitle>
      <GeneralTable
        :rows="gymSubscriptionsEndByClient"
        :columns="GymSubscriptionService.getColumns()"
        :loading="loading"
        :pagination="pagination"
        no-header
        @search="fetchGymSubscriptions(filters)"
        @navigate-to="navigateTo"
      >
      </GeneralTable>
    </div>
  </div>

  <CancelGymSubscriptionDialog
    v-model="showCancelGymSubscription"
    :gym-subscription="gymSubscriptionsActiveByClient"
    @cancel:success="handleCancelSubscription"
    @cancel="showCancelGymSubscription = false"
  />

</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useGymSubscriptionStore } from 'stores/gymSubscription';
import { useGymSubscriptionMemberStore } from 'stores/gymSubscriptionMember';
import { useGymSubscriptionQuoteStore } from 'stores/gymSubscriptionQuote';
import GeneralTable from '../../components/GeneralTable.vue';
import CancelGymSubscriptionDialog from 'src/components/GymSubscription/CancelGymSubscriptionDialog.vue';
import {reactive, computed, watch, ref} from 'vue';
import FormatService from 'src/services/FormatService';
import SecondaryButton from "components/Buttons/SecondaryButton.vue";
import SectionTitle from 'src/components/SectionTitle.vue';
import GymSubscriptionService from 'src/services/GymSubscriptionService';
import GymSubscriptionQuoteService from 'src/services/GymSubscriptionQuoteService';
import GymSubscriptionMemberService from 'src/services/GymSubscriptionMemberService';
import {useQuasar} from "quasar";

const props = defineProps({
  clientId: Number,
});

const { gymSubscriptions, loading, error, pagination } = storeToRefs(useGymSubscriptionStore());
const { gymSubscriptionMembers } = storeToRefs(useGymSubscriptionMemberStore());
const { gymSubscriptionQuotes } = storeToRefs(useGymSubscriptionQuoteStore());
const { fetchGymSubscriptions } = useGymSubscriptionStore();
const { fetchGymSubscriptionMembers } = useGymSubscriptionMemberStore();
const { fetchGymSubscriptionQuotes, deleteGymSubscriptionQuote } = useGymSubscriptionQuoteStore();

const $q = useQuasar();

const filters = reactive({
  client_id: props.clientId,
});

const filterMember = reactive({
  gym_subscription_id: null
})

const gymSubscriptionsEndByClient = computed(() =>
  gymSubscriptions?.value.filter((p) => p.client_id === props.clientId && p.end_date !== null)
);

const gymSubscriptionsActiveByClient = computed(() =>
  gymSubscriptions?.value.find((p) => p.client_id === props.clientId && p.end_date === null)
);

const showCancelGymSubscription = ref(false)

const handleCancelSubscription = () => {
  fetchGymSubscriptions(filters);
  showCancelGymSubscription.value = false
}

watch(gymSubscriptionsActiveByClient, () => {
  if (gymSubscriptionsActiveByClient.value) {
      filterMember.gym_subscription_id = gymSubscriptionsActiveByClient.value.id
      fetchGymSubscriptionMembers(filterMember)
      fetchGymSubscriptionQuotes(filterMember)
  }else {
    gymSubscriptionMembers.value = []
  }
})

fetchGymSubscriptions(filters);


const navigateTo = (page) => {
  filters.page = page;
  fetchGymSubscriptions(filters);
};

const handleDeleteQuote = (id) => {
  $q.dialog({
    title: 'Eliminar',
    message:
      '¿Está seguro que desea eliminar este registro? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteGymSubscriptionQuote(id).then(() => {
        if (error.value === null) {
          fetchGymSubscriptionQuotes(filterMember);
        }
      });
    })
    .onCancel(() => {});

}

</script>
