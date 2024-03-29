<template>
  <SectionTitle>
    Notas
    <q-btn
      v-if="!readOnly"
      class="q-pa-none"
      size="md"
      stretch
      flat
      icon="add"
      @click="showNewNoteForm = true"
      ><q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
        Crear nueva nota
      </q-tooltip>
    </q-btn>
  </SectionTitle>
  <div v-if="showNewNoteForm" class="row q-mb-sm">
    <div class="col-12">
      <q-card>
        <q-card-section>
          <q-form>
            <q-input v-model="form.note" rows="3" type="textarea"></q-input>
            <div class="row q-mt-lg">
              <div class="col-12">
                <PrimaryButton
                  label="Crear nueva nota"
                  flat
                  @click="createClientNote"
                />
                <SecondaryButton
                  class="q-ml-md"
                  label="Cancelar"
                  @click="showNewNoteForm = false"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <q-card v-if="currentNotes.length > 0" class="q-pa-lg">
    <div v-for="note in currentNotes" :key="note.id" class="q-mb-sm">
      <div class="q-pb-sm">
        <b
          >{{ FormatService.setFullDateFormat(note.created_at) }} ({{
            note.createdByUser.name
          }}):</b
        >
        {{ note.note }}
      </div>
      <q-separator color="grey-3" />
    </div>
  </q-card>
</template>

<script setup>
import SectionTitle from '../SectionTitle.vue';
import { ref, reactive, onMounted } from 'vue';
import PrimaryButton from '../Buttons/PrimaryButton.vue';
import SecondaryButton from '../Buttons/SecondaryButton.vue';
import { useClientNoteStore } from 'src/stores/clientNote';
import { useErrorNotification } from 'src/composables/errorNotification';
import { useSuccessNotification } from 'src/composables/successNotification';
import { storeToRefs } from 'pinia';
import FormatService from 'src/services/FormatService';

const props = defineProps({
  clientId: {
    type: Number,
    required: true,
  },
  notes: {
    type: Object,
    default: null,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const currentNotes = ref([]);
const readOnly = ref(false);
const { notifyError } = useErrorNotification();
const { notifySuccess } = useSuccessNotification();
const showNewNoteForm = ref(false);
const { storeClientNote, fetchClientNotes } = useClientNoteStore();
const { validationsErrors, clientNotes } = storeToRefs(useClientNoteStore());
const form = reactive({
  client_id: props.clientId,
  note: '',
});

onMounted(() => {
  currentNotes.value = props.notes;
  readOnly.value = props.readOnly;
});

const createClientNote = () => {
  storeClientNote(form)
    .then(() => {
      if (validationsErrors.value) {
        notifyError('Debe introducir una nota para poder guardar.');
      } else {
        notifySuccess('Nota guardad correctamente');
        form.note = null;
        showNewNoteForm.value = false;
        fetchClientNotes({ client_id: props.clientId }).then(
          () => (currentNotes.value = clientNotes.value)
        );
      }
    })
    .catch(() => notifyError('Ha ocurrido un error inesperado.'));
};
</script>
