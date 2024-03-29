<template>
  <template v-if="currentSaleSessionLoading">Cargando caja actual... </template>
  <template v-else>
    <template v-if="currentSaleSession">
      <div class="row justify-between">
        <SectionTitle>Nueva venta</SectionTitle>
        <div>
          <div class="col">
            <q-select
              v-model="newOrder.company_id"
              :options="[
                {
                  label: 'Balneario Thermas de Griñon',
                  value: 1,
                },
                {
                  label: 'JOSÉ LUIS LÓPEZ SIMÓN',
                  value: 2,
                },
              ]"
              emit-value
              map-options
              dense
              label="Empresa"
              class="q-mb-md"
            >
            </q-select>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="row q-mb-md q-col-gutter-md">
            <div>
              <SecondaryButton
                label="Cliente"
                :class="{
                  'bg-bronze': newOrder.type === 'Cliente',
                  'text-white': newOrder.type === 'Cliente',
                }"
                @click="handleSetOrderType('Cliente')"
              />
            </div>
            <div>
              <SecondaryButton
                label="Venta Telefónica"
                :class="{
                  'bg-bronze': newOrder.type === 'Venta Telefónica',
                  'text-white': newOrder.type === 'Venta Telefónica',
                }"
                @click="handleSetOrderType('Venta Telefónica')"
              />
            </div>
            <div>
              <SecondaryButton
                label="Venta de Mostrador"
                :class="{
                  'bg-bronze': newOrder.type === 'Venta de Mostrador',
                  'text-white': newOrder.type === 'Venta de Mostrador',
                }"
                @click="handleSetOrderType('Venta de Mostrador')"
              />
            </div>
          </div>

          <div v-if="newOrder.type === 'Cliente'" class="q-mb-md">
            <div v-if="clientLoading">
              <q-spinner color="bronze" size="3em" />
            </div>
            <div v-else>
              <div v-if="clientToForm">
                <div class="row q-col-gutter-sm no-wrap">
                  <div>
                    <q-btn
                      stretch
                      flat
                      class="text-bronze"
                      icon="add_box"
                      dense
                      @click="showCreateClientSelection = true"
                    >
                      <q-tooltip
                        max-width="14rem"
                        anchor="top middle"
                        self="bottom middle"
                      >
                        Crear cliente
                      </q-tooltip>
                    </q-btn>
                    <q-btn
                      stretch
                      flat
                      class="text-bronze"
                      icon="change_circle"
                      dense
                      @click="showClientSelection = true"
                    >
                      <q-tooltip
                        max-width="14rem"
                        anchor="top middle"
                        self="bottom middle"
                      >
                        Cambiar cliente
                      </q-tooltip>
                    </q-btn>
                    <EditFlatButton
                      class="text-bronze"
                      @click="showEditClientForm = true"
                    >
                      <q-tooltip
                        max-width="14rem"
                        anchor="top middle"
                        self="bottom middle"
                      >
                        Editar cliente
                      </q-tooltip>
                    </EditFlatButton>
                  </div>
                  <div>
                    <b>Cliente:</b>
                    {{ ClientService.getFullName(clientToForm) }} (<b>NIF:</b>
                    {{ clientToForm.document }})
                    <br />
                    <b>Teléfono: </b> {{ clientToForm.phone }} |
                    <b>Correo electrónico:</b> {{ clientToForm.email }}
                    <br />
                    <b>LOPD:</b>
                    {{ ClientService.getLOPDStatus(clientToForm) }} |
                    <b>Dirección:</b>
                    {{ clientToForm.address }} (cp: {{ clientToForm.postcode }})
                  </div>
                </div>
                <div>
                  <ClientNotes
                    v-if="clientToForm.clientNotes.length > 0"
                    :client-id="clientToForm.id"
                    :notes="clientToForm.clientNotes.slice(0, 2)"
                    :read-only="true"
                  />
                </div>
              </div>
              <div v-else>
                Seleccione o cree un cliente
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <PrimaryButton
                      label="Seleccionar cliente"
                      @click="showClientSelection = true"
                    />
                  </div>
                  <div class="col">
                    <PrimaryButton
                      label="Crear nuevo cliente"
                      @click="showNewClientForm = true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="newOrder.type === 'Venta de Mostrador'" class="q-mb-md">
            <TextInput
              v-model="newOrder.counter_sale_seq"
              label="Número cheque o documento"
            />
          </div>

          <ValidationErrorsList :errors="validationsErrors" />

          <DetailsDashboard :client-id="clientToForm?.id" />

          <TextInput v-model="newOrder.note" class="q-mt-lg" label="Notas" />

          <div class="row q-col-gutter-sm q-mt-lg">
            <div class="col">
              <q-card bordered>
                <q-card-section>
                  <div class="row justify-between q-mb-md">
                    <div>
                      <div class="text-h6">Forma de pago</div>
                      <div v-if="newOrder.discount_id">
                        Descuento seleccionado:
                        {{ newOrder.discount_name }}
                      </div>
                    </div>
                    <div>
                      <q-btn
                        class="text-dark-blue q-mr-md"
                        icon="discount"
                        @click="showDiscountSelection = true"
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">
                          Aplicar descuento
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        class="text-dark-blue"
                        icon="payments"
                        @click="addPayment"
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">
                          Dividir pago
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>

                  <div
                    v-for="(payment, index) in newOrder.payments"
                    :key="payment"
                    class="row q-col-gutter-sm q-mb-sm"
                  >
                    <div class="col-1 flex items-center justify-center">
                      <div v-if="index !== 0">
                        <q-btn
                          size="sm"
                          dense
                          icon="remove_circle_outline"
                          @click="newOrder.payments.splice(index, 1)"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-select
                        v-model="payment.type"
                        :options="[
                          'Efectivo',
                          'Tarjeta de Crédito',
                          'Transferencia',
                        ]"
                        emit-value
                        map-options
                        dense
                        label="Agenda"
                      />
                    </div>
                    <div class="col-12 col-md-5">
                      <NumberInput v-model="payment.amount" label="Importe" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card bordered>
                <q-card-section>
                  TOTAL TICKET: {{ orderTotalAmount }} €

                  <q-field
                    label="Acumulado"
                    stack-label
                    filled
                    dense
                    class="q-mt-sm"
                  >
                    <template #control>
                      <div
                        class="self-center full-width no-outline"
                        tabindex="0"
                      >
                        {{ paidAmount }}
                      </div>
                    </template>
                  </q-field>
                  <q-field
                    class="q-mt-sm"
                    label="Pendiente"
                    stack-label
                    filled
                    dense
                    :bg-color="pendingAmount > 0 ? 'pink-4' : ''"
                  >
                    <template #control>
                      <div
                        class="self-center full-width no-outline"
                        tabindex="0"
                      >
                        {{ pendingAmount }}
                      </div>
                    </template>
                  </q-field>

                  <q-field
                    :bg-color="returnedAmount > 0 ? 'pink-4' : ''"
                    class="q-mt-sm"
                    filled
                    dense
                    label="Devolución"
                    stack-label
                  >
                    <template #control>
                      <div
                        class="self-center full-width no-outline"
                        tabindex="0"
                      >
                        {{ returnedAmount }}
                      </div>
                    </template>
                  </q-field>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <PrimaryButton
            label="Finalizar compra"
            flat
            class="q-mt-md"
            :disabled="!newOrderIsValid || orderLoading"
            @click="sendOrder"
          />
          <q-toggle
            v-model="printTicket"
            class="q-ml-lg"
            label="Imprimir ticket"
          />
        </div>
        <div class="col-6">
          <ProductDashboard @product-selected="addDetail" />
        </div>
      </div>
    </template>

    <div v-else class="text-center q-mt-lg">
      <div>No hay una sesión de ventas activa.</div>

      <q-btn
        flat
        class="q-mt-md"
        label="Abrir caja"
        color="primary"
        @click="showCreateSessionForm = true"
      />
      <q-btn
        flat
        class="q-mt-md"
        label="Reabrir última caja"
        color="negative"
        @click="reopenSaleSession"
      />
    </div>
  </template>

  <SelectCreateClientDialog
    v-model="showCreateClientSelection"
    @client:selected="showCreateClientSelection = false"
    @cancel="showCreateClientSelection = false"
  />

  <SelectClientDialog
    v-model="showClientSelection"
    @client:selected="showClientSelection = false"
    @cancel="showClientSelection = false"
  />

  <SelectDiscountDialog
    v-model="showDiscountSelection"
    @discount:selected="discountSelected"
    @discount:unset="unsetDiscount"
  />

  <q-dialog v-model="showNewClientForm" full-width persistent>
    <q-card class="q-pa-lg" style="height: 80vh">
      <q-card-section>
        <SectionTitle>Crear nuevo cliente </SectionTitle>
        <ClientForm
          @create:success="clientCreated"
          @cancel="showNewClientForm = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showEditClientForm" full-width persistent>
    <q-card class="q-pa-lg" style="height: 80vh">
      <q-card-section>
        <SectionTitle>Editar datos de cliente </SectionTitle>
        <ClientForm
          :client="clientToForm"
          @update:success="clientUpdated()"
          @cancel="showEditClientForm = false"
        />
      </q-card-section>
      <q-card-section>
        <ClientNotes
          :client-id="clientToForm.id"
          :notes="clientToForm.clientNotes"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showCreateSessionForm" persistent>
    <q-card style="width: 28vw; height: 37vh">
      <q-card-section class="row">
        <CreateSaleSession
          @create:success="showCreateSessionForm = false"
          @cancel="showCreateSessionForm = false"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <iframe v-show="false" ref="iframe" name="ticket"></iframe>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import EditFlatButton from 'src/components/Buttons/EditFlatButton.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import ClientForm from 'src/components/Client/ClientForm.vue';
import SelectCreateClientDialog from 'src/components/Client/SelectCreateClientDialog.vue';
import SelectClientDialog from 'src/components/Client/SelectClientDialog.vue';
import SelectDiscountDialog from 'src/components/Discount/SelectDiscountDialog.vue';
import NumberInput from 'src/components/Form/NumberInput.vue';
import ValidationErrorsList from 'src/components/Form/ValidationErrorsList.vue';
import DetailsDashboard from 'src/components/Order/DetailsDashboard.vue';
import ProductDashboard from 'src/components/Order/ProductDashboard.vue';
import CreateSaleSession from 'src/components/SaleSession/CreateSaleSession.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import { useErrorNotification } from 'src/composables/errorNotification';
import ClientService from 'src/services/ClientService';
import { useAuthStore } from 'src/stores/auth';
import { useClientStore } from 'src/stores/client';
import { useOrderStore } from 'src/stores/order';
import { useProductStore } from 'src/stores/product';
import { useSaleSessionStore } from 'src/stores/saleSession';
import { useAppStore } from 'stores/app';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import ClientNotes from 'src/components/Client/ClientNotes.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import TextInput from 'src/components/Form/TextInput.vue';
import { usePdfUtils } from 'src/composables/pdfUtils';

const orderStore = useOrderStore();
const clientStore = useClientStore();

const props = defineProps({
  clientId: String,
});

const { clientToForm, loading: clientLoading } = storeToRefs(useClientStore());
const {
  loading: orderLoading,
  error: orderError,
  validationsErrors,
  newOrder,
  pdfTicket,
} = storeToRefs(useOrderStore());
const { currentSaleSession, currentSaleSessionLoading } = storeToRefs(
  useSaleSessionStore()
);
const { user } = storeToRefs(useAuthStore());
const { productDiscounts } = storeToRefs(useProductStore());

const { fetchClientToForm } = useClientStore();
const { createOrder, prepareNewOrder, getPdfTicket } = useOrderStore();
const { fetchCurrentSaleSession, reopenSaleSession } = useSaleSessionStore();
const { fetchProductDiscounts } = useProductStore();

const { fetchProfile } = useAuthStore();
const { hideMenu } = useAppStore();

const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const { dataURItoBlob } = usePdfUtils();

onMounted(() => {
  hideMenu();

  fetchCurrentSaleSession();
  validationsErrors.value = null;

  useClientStore().$reset();
  if (props.clientId) {
    fetchClientToForm(props.clientId);
  }

  fetchProfile().then(() =>
    prepareNewOrder(
      selectedClientId,
      orderTotalAmount,
      user.value?.default_company_id
    ).then(() => {
      if (props.clientId) {
        newOrder.value.type = 'Cliente';
      }
    })
  );
});

const showCreateClientSelection = ref(false);
const showClientSelection = ref(false);
const showDiscountSelection = ref(false);
const showNewClientForm = ref(false);
const showCreateSessionForm = ref(false);
const showEditClientForm = ref(false);
const printTicket = ref(false);

const selectedClientId = computed(() => clientToForm.value?.id);
const orderTotalAmount = computed(() =>
  newOrder.value.details.reduce(
    (n, { price, quantity }) => n + price * quantity,
    0
  )
);
const paidAmount = computed(() =>
  newOrder.value.payments.reduce((n, { amount }) => n + amount, 0)
);
const pendingAmount = computed(() => {
  const pendingAmount = (orderTotalAmount.value - paidAmount.value).toFixed(2);

  return pendingAmount > 0 ? pendingAmount : 0;
});
const returnedAmount = computed(() => {
  const pendingAmount = (paidAmount.value - orderTotalAmount.value).toFixed(2);

  return pendingAmount > 0 ? pendingAmount : 0;
});
const newOrderIsValid = computed(
  () =>
    newOrder.value.details.length !== 0 &&
    newOrder.value.type !== null &&
    (newOrder.type !== 'Cliente' ||
      (newOrder.value.type === 'Cliente' && clientToForm.value)) &&
    pendingAmount.value === 0
);

const clientCreated = (client) => {
  notifySuccess('Cliente creado correctamente');
  fetchClientToForm(client.value.id);
  showNewClientForm.value = false;
};
const clientUpdated = () => {
  showEditClientForm.value = false;
  fetchClientToForm(clientToForm.value.id);
};

const addDetail = (product) => {
  let price = null;
  if (newOrder.value.discount_id) {
    const discount = productDiscounts.value.find(
      (productDiscount) => productDiscount.product_id === product.id
    );

    if (discount !== undefined) {
      price = discount.price;
    } else {
      price = product.price;
    }
  } else {
    price = product.price;
  }

  newOrder.value.details.push(
    reactive({
      line_id: newOrder.value.auto_increment,
      product_id: product.id,
      product_name: product.name,
      product: product,
      quantity: ref(1),
      price: price,
      reservations: [],
    })
  );

  newOrder.value.auto_increment++;
};

const addPayment = () => {
  newOrder.value.payments.push(
    reactive({
      type: 'Efectivo',
      amount: null,
      paid_amount: null,
      returned_amount: null,
    })
  );
};

const validateQuantityCircuit = () => {
  let validQuantity = true
  newOrder.value.details.map(detail => {
    let reservationQuantity = 0
    detail.reservations.map(reservation => {
      if (reservation.type === 'Circuit'){
        reservationQuantity += (reservation.children + reservation.adults)
      }
    })
    console.log(reservationQuantity, detail.quantity)
    if (reservationQuantity > detail.quantity) {
      validQuantity = false
    }
  })

  return validQuantity
}

const validateReservation = () => {
  for (const detail of newOrder.value.details) {
    if (detail.product.all_reserves_on_same_day) {
      const isValid = detail.reservations.every(
        (reservation) => reservation.date === detail.reservations[0].date
      );

      if (!isValid) {
        notifyError(
          'Para el producto ' +
            detail.product.name +
            ' todas las reservas deben hacerse para el mismo día.'
        );
      }
    }
  }
};

orderStore.$subscribe(() => {
  validateReservation();
});

const sendOrder = () => {
  if (!validateQuantityCircuit()) {
    notifyError(
        'La cantidad del producto no puede ser menor que la cantidad de personas en las reservas'
      );
      return
  }
  let cashInfoFilled = false;
  for (let payment of newOrder.value.payments) {
    payment.paid_amount = payment.amount;

    if (payment.type === 'Efectivo' && !cashInfoFilled) {
      payment.returned_amount = returnedAmount.value;
      cashInfoFilled = true;
    } else {
      payment.returned_amount = 0;
    }
  }

  createOrder(newOrder.value).then(() => {
    if (orderError.value) {
      notifyError(
        'Ha ocurrido un error al intentar crear el registro de venta'
      );
    } else {
      notifySuccess('Venta guardada correctamente');
      if (printTicket.value) {
        downloadPdfTicket(orderStore.order.id);
      }
      orderStore.$reset();
      clientStore.$reset();
      prepareNewOrder(
        selectedClientId,
        orderTotalAmount,
        user.value?.default_company_id
      );
    }
  });
};

const clientSelected = (client) => {
  newOrder.value.client_id = client.id;
};

const discountSelected = (discount) => {
  newOrder.value.discount_id = discount.id;
  newOrder.value.discount_name = discount.name;
  showDiscountSelection.value = false;
};

const handleSetOrderType = (type) => {
  newOrder.value.type = type;
};

const iframe = ref(null);

const downloadPdfTicket = (id) => {
  getPdfTicket(id)
    .then(() => {
      const blob = dataURItoBlob(pdfTicket.value.content);
      const url = URL.createObjectURL(blob);

      iframe.value.src = '';
      iframe.value.src = url;
      iframe.value.onload = function () {
        var ticketFrame = window.frames['ticket'];
        ticketFrame.focus();
        ticketFrame.print();
      };
    })
    .catch((e) => {
      console.log(e);
      notifyError('Ha ocurrido un error al intentar descargar el PDF.');
    });
};

watch(
  () => newOrder.value.discount_id,
  () => {
    fetchProductDiscounts(newOrder.value.discount_id).then(() => {
      newOrder.value.details.forEach((detail) => {
        const discount = productDiscounts.value.find(
          (productDiscount) => productDiscount.product_id === detail.product_id
        );

        if (discount !== undefined) {
          detail.price = discount.price;
        }
      });
    });
  }
);

const unsetDiscount = () => {
  newOrder.value.discount_id = null;
  newOrder.value.discount_name = null;
  showDiscountSelection.value = false;
};
</script>
