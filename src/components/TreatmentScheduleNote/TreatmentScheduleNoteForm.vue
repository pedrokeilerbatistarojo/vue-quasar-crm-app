<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.from_hour"
          label="Hasta"
          mask="time"
          :rules="['time']"
        >
          <template #append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="form.from_hour">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.to_hour"
          label="Hasta"
          mask="time"
          :rules="['time']"
        >
          <template #append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="form.to_hour">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12">
        <q-input
          v-model="form.note"
          rows="3"
          type="textarea"
          label="Nota *"
          :rules="[(val) => InputValidationService.required(val)]"
        ></q-input>
      </div>
    </div>
    <div class="row justify-between q-mt-lg">
      <div>
        <PrimaryButton label="Guardar" type="submit" />
        <SecondaryButton
          class="q-ml-md"
          label="Cancelar"
          @click="$emit('cancel')"
        />
      </div>
      <SecondaryButton
        v-if="isEditing && treatmentScheduleNote.id"
        class="q-ml-md bg-red text-white"
        label="Eliminar evento"
        @click="confirmDelete"
      />
    </div>
  </q-form>
</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import { onMounted, reactive, ref } from 'vue';
import { useTreatmentScheduleNoteStore } from 'stores/treatmentScheduleNote';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import { useSuccessNotification } from 'src/composables/successNotification';
import { useErrorNotification } from 'src/composables/errorNotification';
import TextInput from '../Form/TextInput.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps({
  treatmentScheduleNote: Object,
});
const emit = defineEmits([
  'create:success',
  'update:success',
  'deleted:success',
  'cancel',
]);

const { error, loading, validationsErrors, treatmentScheduleNote } =
  storeToRefs(useTreatmentScheduleNoteStore());
const {
  editTreatmentScheduleNote,
  storeTreatmentScheduleNote,
  deleteTreatmentScheduleNote,
} = useTreatmentScheduleNoteStore();
const { notifySuccess } = useSuccessNotification();
const { notifyError } = useErrorNotification();
const isEditing = ref(false);
const form = reactive({
  id: props.treatmentScheduleNote?.id,
  date: props.treatmentScheduleNote?.date,
  from_hour: props.treatmentScheduleNote?.from_hour,
  to_hour: props.treatmentScheduleNote?.to_hour,
  employee_id: props.treatmentScheduleNote?.employee_id,
  note: props.treatmentScheduleNote?.note,
});

onMounted(() => {
  if (props.treatmentScheduleNote.id) {
    isEditing.value = true;
  }
});

const onSubmit = () => {
  if (isEditing.value) {
    return update();
  }

  return create();
};

const update = async () => {
  await editTreatmentScheduleNote(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al editar el evento');
    } else {
      notifySuccess();
      emit('update:success', treatmentScheduleNote);
    }
  });
};

const create = async () => {
  await storeTreatmentScheduleNote(form).then(() => {
    if (error.value) {
      notifyError('Ha ocurrido un error al crear registro');
    } else {
      notifySuccess('Nuevo evento creado correctamente');
      emit('create:success', treatmentScheduleNote);
    }
  });
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar evento',
    message:
      '¿Está seguro que desea eliminar este evento? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteTreatmentScheduleNote(props.treatmentScheduleNote.id).then(() => {
        if (error.value === null) {
          emit('deleted:success');
        }
      });
    })
    .onCancel(() => {});
};
</script>
