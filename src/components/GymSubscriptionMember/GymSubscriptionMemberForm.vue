<template>
  <ValidationErrorsList :errors="validationsErrors" />

  <q-form @submit="onSubmit">
    <div class="row q-my-md">
      <div class="col-12 col-md-4 col-lg-3">
        <SecondaryButton
          class="q-mr-lg"
          label="Seleccionar cliente"
          @click="showClientSelection = true"
        />
        <SecondaryButton
          label="Crear cliente"
          @click="showCreateClientSelection = true"
        />
        <div v-if="clientToForm" class="q-my-lg">
          <b>Cliente:</b>
          {{ clientToForm.name }} (<b>NIF:</b>
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
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4 col-lg-3">
        <q-input
          v-model="form.date_from"
          dense type="date"
          label="Fecha de inicio *"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
      <div class="col-12 col-md-4 col-lg-3">
        <q-input
          v-model="form.date_to"
          dense type="date"
          label="Fecha de expiración *"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="q-mt-lg">
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
      />
    </div>
  </q-form>

  <SelectCreateClientDialog
    v-model="showCreateClientSelection"
    @client:selected="handleSelectClient"
    @cancel="showCreateClientSelection = false"
  />

  <SelectClientDialog
    v-model="showClientSelection"
    @client:selected="handleSelectClient"
    @cancel="showClientSelection = false"
  />

</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import {computed, onMounted, reactive, ref, watch} from 'vue';
import { useGymSubscriptionMemberStore } from 'stores/gymSubscriptionMember.js';
import { useGymSubscriptionStore } from 'stores/gymSubscription.js';
import { useClientStore } from 'stores/client.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";
import SelectCreateClientDialog from 'src/components/Client/SelectCreateClientDialog.vue';
import SelectClientDialog from 'src/components/Client/SelectClientDialog.vue';
import ClientService from 'src/services/ClientService';
import FormatService from "src/services/FormatService";

const router = useRouter();

const props = defineProps({
  gymSubscriptionId: String,
});

const showCreateClientSelection = ref(false);
const showClientSelection = ref(false);


const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { error, loading, validationsErrors, gymSubscriptionMember } = storeToRefs(
  useGymSubscriptionMemberStore()
);

const { clientToForm } = storeToRefs(useClientStore())
const { gymSubscription } = storeToRefs(useGymSubscriptionStore());

const { editGymSubscriptionMember, storeGymSubscriptionMember } = useGymSubscriptionMemberStore();
const { fetchGymSubscription } = useGymSubscriptionStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);

const form = reactive({
  id: props.gymSubscriptionMember?.id,
  gym_subscription_id: props.gymSubscriptionMember?.gym_subscription_id,
  client_id: props.gymSubscriptionMember?.client_id,
  date_from: props.gymSubscriptionMember?.date_from,
  date_to: props.gymSubscriptionMember?.date_to,
});

const selectedClientId = computed(() => clientToForm.value?.id);

onMounted(() => {
  clientToForm.value = null
  if (props.gymSubscriptionMember) {
    isEditing.value = true;
  }
  fetchGymSubscription(props.gymSubscriptionId)
  form.gym_subscription_id = props.gymSubscriptionId ?? null
});

const onSubmit = () => {
  if (isEditing.value) {
    return update();
  }
  return create();
};

const handleSelectClient = () => {
  showCreateClientSelection.value = false
  showClientSelection.value = false
  form.client_id = selectedClientId.value
}

const update = async () => {
  await editGymSubscriptionMember(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar registro');
    } else {
      notifySuccess();
      emit('update:success');
    }
  });
};

const create = async () => {
  await storeGymSubscriptionMember(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear registro');
    } else {
      notifySuccess('Nueva asociación creada correctamente');
      emit('create:success');
    }
  });
};

watch(gymSubscription, () => {
  if (gymSubscription.value){
    form.date_from = FormatService.setDateFormatYYYYmmdd(gymSubscription.value.start_date)
    form.date_to = FormatService.setDateFormatYYYYmmdd(gymSubscription.value.expiration_date)
  }
})

</script>
