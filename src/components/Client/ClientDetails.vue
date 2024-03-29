<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
  >
    <q-tab name="general" label="General" />
    <q-tab name="orders" label="Compras" />
    <q-tab name="reserves" label="Reservas" />
    <q-tab name="reservesTrashed" label="Reservas canceladas" />
    <q-tab name="payments" label="Pagos" />
    <q-tab name="member" label="Socio" />
    <q-tab name="documents" label="Documentos" />
  </q-tabs>
  <q-tab-panels v-model="tab" style="min-height: 500px" animated>
    <q-tab-panel name="general">
      <SectionTitle>
        Datos de Cliente
        <q-btn
          stretch
          flat
          icon="edit"
          :to="{ name: 'clients.edit', params: { id: client.id } }"
          ><q-tooltip
            max-width="14rem"
            anchor="top middle"
            self="bottom middle"
          >
            Editar cliente
          </q-tooltip>
        </q-btn></SectionTitle
      >

      <div class="row">
        <div class="col-12 col-md-4">
          <p><b>ID:</b> {{ client.id }}</p>
          <p><b>Nombre:</b> {{ client.name }}</p>
          <p><b>Documento:</b> {{ client.document }}</p>
          <p>
            <b>LOPD: </b>
            <span v-if="client.lopd_agree == null">Pendiente</span>
            <span v-if="client.lopd_agree != null && !client.lopd_agree"
              >No firmada</span
            >
            <span v-if="client.lopd_agree"
              >Firmada
              <q-btn
                flat
                dense
                icon="download"
                style="font-weight: bold"
                text-color="primary"
                :loading="loadingTemplate"
                @click="handleDownloadTemplate"
              >
                <q-tooltip
                  max-width="14rem"
                  anchor="top middle"
                  self="bottom middle"
                >
                  Descargar plantilla
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                icon="mail"
                dense
                text-color="primary"
                :loading="loadingConsentEmail"
                @click="sendConsentEmail(client)"
              >
                <q-tooltip
                  max-width="14rem"
                  anchor="top middle"
                  self="bottom middle"
                >
                  Enviar email de consentimiento expreso
                </q-tooltip>
              </q-btn>
            </span>
          </p>
        </div>

        <div class="col-12 col-md-4">
          <p><b>Teléfono:</b> {{ client.phone }}</p>
          <p><b>Fecha de nacimiento:</b> {{ client.birthdate }}</p>
          <p><b>Email:</b> {{ client.email }}</p>
        </div>
        <div class="col-12 col-md-4">
          <p><b>Dirección:</b> {{ client.address }}</p>
          <p><b>Código Postal:</b> {{ client.postcode }}</p>
          <p><b>Localidad:</b> {{ client.locality?.locality }}</p>
          <p><b>Provincia:</b> {{ client.locality?.province?.name }}</p>
        </div>
      </div>
      <div class="row">
        <SecondaryButton
          label="Nueva venta"
          :to="{
            name: 'orders.dashboard',
            query: { clientId: client.id },
          }"
        />
        <SecondaryButton
          class="q-ml-md"
          label="Pre-reserva circuito"
          @click="handlePreReservation"
        />
        <SecondaryButton
          class="q-ml-md"
          label="Pre-reserva tratamiento"
          @click="showTreatmentReservationForm = true"
        />
      </div>
      <div class="row">
        <div class="col-12">
          <ClientNotes :notes="client.clientNotes" :client-id="client.id" />
        </div>
      </div>
      <div class="row">
        <SectionTitle>Próximas reservas</SectionTitle>
      </div>
      <q-card
        v-for="reservation of pendingCircuitReservations"
        :key="reservation.id"
        class="bg-blue-2 q-pa-sm q-mb-sm"
      >
        <b>Compra: </b>
        {{
          reservation.orderDetails
            ? reservation.orderDetails[0].order.locator
            : 'SIN COMPRA'
        }}
        <ReservationCard
          :reservation="reservation"
          class="card q-mt-sm"
          type="circuit"
          @updated:success="fetchCircuitReservations({ client_id: client.id })"
          @deleted:success="fetchCircuitReservations({ client_id: client.id })"
        />
      </q-card>
      <q-card
        v-for="reservation of pendingTreatmentReservations"
        :key="reservation.id"
        style="background-color: #f0e68c"
        class="q-pa-sm q-mb-sm"
      >
        <b>Compra: </b>
        {{
          reservation.orderDetails
            ? reservation.orderDetails[0].order.locator
            : 'SIN COMPRA'
        }}
        <ReservationCard
          :reservation="reservation"
          class="card q-mt-sm"
          type="treatment"
          @updated:success="
            fetchTreatmentReservations({ client_id: client.id })
          "
          @deleted:success="
            fetchTreatmentReservations({ client_id: client.id })
          "
        />
      </q-card>
    </q-tab-panel>

    <q-tab-panel name="orders">
      <div v-if="orderLoading">Cargando...</div>

      <OrderTable :client-id="client.id" />
    </q-tab-panel>

    <q-tab-panel name="reserves">
      <SectionTitle>Todas las reservas</SectionTitle>
      <q-card
        v-for="reservation of circuitReservations"
        :key="reservation.id"
        class="bg-blue-2 q-pa-sm q-mb-sm"
      >
        <b>Compra: </b>
        {{
          reservation.orderDetails
            ? reservation.orderDetails[0].order.locator
            : 'SIN COMPRA'
        }}
        <ReservationCard
          :reservation="reservation"
          class="card q-mt-sm"
          type="circuit"
          @updated:success="fetchCircuitReservations({ client_id: client.id })"
          @deleted:success="fetchCircuitReservations({ client_id: client.id })"
        />
      </q-card>
      <q-card
        v-for="reservation of treatmentReservations"
        :key="reservation.id"
        style="background-color: #f0e68c"
        class="q-pa-sm q-mb-sm"
      >
        <b>Compra: </b>
        {{
          reservation.orderDetails
            ? reservation.orderDetails[0].order.locator
            : 'SIN COMPRA'
        }}
        <ReservationCard
          :reservation="reservation"
          class="card q-mt-sm"
          type="treatment"
          @updated:success="
            fetchTreatmentReservations({ client_id: client.id })
          "
          @deleted:success="
            fetchTreatmentReservations({ client_id: client.id })
          "
        />
      </q-card>
    </q-tab-panel>

    <q-tab-panel name="reservesTrashed">
      <SectionTitle>Todas las reservas</SectionTitle>
      <q-card
        v-for="reservation of circuitReservationsWithTrashed"
        :key="reservation.id"
        class="bg-blue-2 q-pa-sm q-mb-sm"
      >
        <b>Compra: </b>
        {{
          reservation.orderDetails
            ? reservation.orderDetails[0].order.locator
            : 'SIN COMPRA'
        }}
        <ReservationCard
          :editable="false"
          :reservation="reservation"
          class="card q-mt-sm"
          type="circuit"
        />
      </q-card>
      <q-card
        v-for="reservation of treatmentReservationsWithTrashed"
        :key="reservation.id"
        style="background-color: #f0e68c"
        class="q-pa-sm q-mb-sm"
      >
        <b>Compra: </b>
        {{
          reservation.orderDetails
            ? reservation.orderDetails[0].order.locator
            : 'SIN COMPRA'
        }}
        <ReservationCard
          :editable="false"
          :reservation="reservation"
          class="card q-mt-sm"
          type="treatment"
        />
      </q-card>
    </q-tab-panel>

    <q-tab-panel name="payments">
      <PaymentTable :payments="paymentsOrders" :client-id="client.id" />
    </q-tab-panel>

    <q-tab-panel name="member">
      <ClientGymSubscription :client-id="client.id" />
    </q-tab-panel>
    <q-tab-panel name="documents">
      <ClientFilesPanel :client="client" />
    </q-tab-panel>
  </q-tab-panels>

  <CircuitReservationDialogForm
    v-model="showCircuitReservationForm"
    :client="client"
    :pre-reservation="isPreReservation"
    @created:success="reservationCreated('circuit')"
    @cancel="showCircuitReservationForm = false; isPreReservation = false"
  />
  <TreatmentReservationDialogForm
    v-model="showTreatmentReservationForm"
    :client="client"
    @created:success="reservationCreated('treatment')"
    @cancel="showTreatmentReservationForm = false"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import OrderTable from 'src/components/Order/OrderTable.vue';
import PaymentTable from 'src/components/Payment/PaymentTable.vue';
import ReservationCard from 'src/components/Reservation/ReservationCard.vue';
import TreatmentReservationDialogForm from 'src/components/Reservation/TreatmentReservationDialogForm.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import { useCircuitReservationStore } from 'src/stores/circuitReservation';
import { useTreatmentReservationStore } from 'src/stores/treatmentReservation';
import { useOrderStore } from 'stores/order.js';
import { computed, ref, reactive } from 'vue';
import CircuitReservationDialogForm from '../Reservation/CircuitReservationDialogForm.vue';
import ClientNotes from './ClientNotes.vue';
import ClientGymSubscription from './ClientGymSubscription.vue';
import { usePdfUtils } from 'src/composables/pdfUtils';
import { useClientStore } from 'stores/client.js';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';

import ClientFilesPanel from './ClientFilesPanel.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps({ client: { type: Object, required: true } });
const { loading: orderLoading, paymentsOrders } = storeToRefs(useOrderStore());
const { circuitReservations, circuitReservationsWithTrashed } = storeToRefs(useCircuitReservationStore());
const { treatmentReservations, treatmentReservationsWithTrashed } = storeToRefs(useTreatmentReservationStore());
const { templatePdf, error } = storeToRefs(useClientStore());
const { notifyError } = useErrorNotification();
const { notifySuccess } = useSuccessNotification();

const { fetchCircuitReservations, fetchCircuitReservationsWithTrashed } = useCircuitReservationStore();
const { fetchTreatmentReservations, fetchTreatmentReservationsWithTrashed } = useTreatmentReservationStore();
const { fetchDownloadTemplate, sendConsentMail } = useClientStore();

const { dataURItoBlob } = usePdfUtils();

const showCircuitReservationForm = ref(false);
const showTreatmentReservationForm = ref(false);
const tab = ref('general');
const loadingTemplate = ref(false);
const isPreReservation = ref(false);
const loadingConsentEmail = ref(false);
const sendConsentForm = reactive({
  id: null,
  email: '',
});

fetchCircuitReservations({ client_id: props.client.id });
fetchCircuitReservationsWithTrashed({ client_id: props.client.id });
fetchTreatmentReservations({ client_id: props.client.id });
fetchTreatmentReservationsWithTrashed({ client_id: props.client.id });

const pendingCircuitReservations = computed(() =>
  circuitReservations.value.filter((r) => r.used === false)
);
const pendingTreatmentReservations = computed(() =>
  treatmentReservations.value.filter((r) => r.used === false)
);

const reservationCreated = (type) => {
  if (type === 'circuit') {
    fetchCircuitReservations({ client_id: props.client.id });
    showCircuitReservationForm.value = false;
  } else {
    fetchTreatmentReservations({ client_id: props.client.id });
    showTreatmentReservationForm.value = false;
  }
  isPreReservation.value = false
};

const handlePreReservation = () => {
  isPreReservation.value = true
  showCircuitReservationForm.value = true
}

const handleDownloadTemplate = () => {
  loadingTemplate.value = true;
  fetchDownloadTemplate(props.client.id)
    .then(() => {
      const blob = dataURItoBlob(templatePdf.value.content);
      const url = URL.createObjectURL(blob);
      loadingTemplate.value = false;
      window.open(url, '_blank');
    })
    .catch(() => {
      loadingTemplate.value = false;
      notifyError('Ha ocurrido un error al intentar descargar el PDF.');
    });
};

const sendConsentEmail = (client) => {
  loadingConsentEmail.value = true;
  $q.dialog({
    title: 'Enviar consentimiento expreso por correo electrónico',
    message: 'Correo electrónico',
    prompt: {
      model: client.email,
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((email) => {
    loadingConsentEmail.value = true;
    sendConsentForm.email = email;
    sendConsentForm.id = client.id;
    sendConsentMail(sendConsentForm).then(() => {
      if (!error.value) {
        notifySuccess('Correo enviado satisfactoriamente.');
      } else {
        notifyError('Ha ocurrido un error al enviar el correo.');
      }
      loadingConsentEmail.value = false;
    });
  });
};
</script>
