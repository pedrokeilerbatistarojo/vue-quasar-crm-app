<template>
  <q-card>
    <q-card-section>
      <span class="text-h6">Adjuntar nuevo fichero</span>
      <div class="flex q-col-gutter-sm">
        <div class="col">
          <q-file
            v-model="fileForm.file"
            dense
            color="grey"
            label="Fichero"
            name="file"
            counter
            square
            flat
            bordered
            clearable
          >
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col">
          <TextInput
            v-model="fileForm.description"
            label="Descripción del fichero"
          />
        </div>
      </div>
      <PrimaryButton
        label="Subir documento"
        :disabled="!fileForm.file"
        @click="uploadFile"
      ></PrimaryButton>
    </q-card-section>
  </q-card>
  <br />
  <ClientFilesTable
    v-if="currentFiles"
    :files="currentFiles"
    :loading="loading"
  />
</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import TextInput from 'src/components/Form/TextInput.vue';
import { useClientFileStore } from 'stores/clientFile.js';
import { reactive, onMounted, ref } from 'vue';
import ClientFilesTable from './ClientFilesTable.vue';
import { useErrorNotification } from 'src/composables/errorNotification';
import { useSuccessNotification } from 'src/composables/successNotification';
import { storeToRefs } from 'pinia';

const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
});

const { storeClientFile, fetchClientFiles } = useClientFileStore();
const { loading, clientFiles, validationsErrors } = storeToRefs(
  useClientFileStore()
);
const fileForm = reactive({
  file: null,
  description: null,
  client_id: props.client.id,
});
const currentFiles = ref(null);
const { notifyError } = useErrorNotification();
const { notifySuccess } = useSuccessNotification();

onMounted(() => {
  currentFiles.value = props.client.clientFiles;
});

const uploadFile = () => {
  storeClientFile(fileForm)
    .then(() => {
      if (validationsErrors.value) {
        notifyError('Debe adjuntar un fichero antes de guardar.');
      } else {
        notifySuccess('Fichero subido correctamente');
        fileForm.description = null;
        fileForm.file = null;
        fetchClientFiles({ client_id: props.clientId }).then(
          () => (currentFiles.value = clientFiles.value)
        );
      }
    })
    .catch(() => notifyError('Ha ocurrido un error inesperado.'));
};
</script>
