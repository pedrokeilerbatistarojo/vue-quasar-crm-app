<template>
  <q-dialog persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 80vw;">
      <q-card-section>
        <SectionTitle class="block">
          Dar de baja suscripción: {{props.gymSubscription?.id}}
        </SectionTitle>
      </q-card-section>
      <q-card-section>
        <q-form @keydown.enter.prevent @submit="onSubmit">
          <div class="q-pa-md">
            <q-input
              v-model="form.end_date"
              dense type="date"
              label="Fecha de baja *"
              stack-label
              :rules="[(val) => InputValidationService.required(val)]"
            />
          </div>
          <div class="q-pa-md">
            <PrimaryButton label="Guardar" type="submit" />
            <SecondaryButton
              class="q-ml-md"
              label="Cancelar"
              @click="$emit('cancel')"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import SectionTitle from '../SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from 'src/services/InputValidationService';
import { useGymSubscriptionStore } from 'src/stores/gymSubscription';
import {reactive} from "vue";
import {useQuasar} from "quasar";

const props = defineProps({
  gymSubscription: Object
});

const $q = useQuasar()

const { error } = storeToRefs(useGymSubscriptionStore());
const { editGymSubscription } = useGymSubscriptionStore();

const form = reactive({
  id: props.gymSubscription?.id,
  client_id: props.gymSubscription?.client_id,
  gym_fee_type_id: props.gymSubscription?.gym_fee_type_id,
  gym_fee_type_name: props.gymSubscription?.gym_fee_type_name,
  price: props.gymSubscription?.price,
  activation_date: props.gymSubscription?.activation_date,
  start_date: props.gymSubscription?.start_date,
  end_date: props.gymSubscription?.end_date,
  expiration_date: props.gymSubscription?.expiration_date,
  payment_day: props.gymSubscription?.payment_day,
  biweekly_payment_day: props.gymSubscription?.biweekly_payment_day,
  payment_type: props.gymSubscription?.payment_type,
});


const emit = defineEmits(['cancel:success', 'cancel']);

const onSubmit = () => {
  updateGymSubscription()
}

const updateGymSubscription = async () => {
  let data = props.gymSubscription
  data.end_date = form.end_date
  await editGymSubscription(data).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al intentar dar de baja',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Cambios guardados correctamente',
      });

      emit('cancel:success');
    }
  });
};

</script>
