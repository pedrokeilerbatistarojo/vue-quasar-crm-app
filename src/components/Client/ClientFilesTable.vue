<template>
  <q-table
    :rows="files"
    :columns="columns"
    row-key="id"
    flat
    bordered
    wrap-cells
  >
    <template #body-cell-actions="scope">
      <q-td :auto-width="true">
        <q-btn
          stretch
          flat
          icon="description"
          @click="downloadFileInfo(scope.key)"
        >
          <q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
            Descargar fichero
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useErrorNotification } from 'src/composables/errorNotification';
import { usePdfUtils } from 'src/composables/pdfUtils';
import { useSuccessNotification } from 'src/composables/successNotification';
import FormatService from 'src/services/FormatService';
import { useOrderStore } from '../../stores/order';

import { useClientFileStore } from '../../stores/clientFile.js';
const { getDocument } = useClientFileStore();
const { fileInfo } = storeToRefs(useClientFileStore());

const props = defineProps({
  files: {
    type: Object,
    required: false,
    default: null,
  },
});

const columns = [
  { name: 'actions' },
  {
    name: 'description',
    required: true,
    align: 'left',
    label: 'Descripción',
    field: 'description',
  },
  {
    name: 'date',
    align: 'left',
    label: 'Fecha',
    sortable: false,
    field: (field) => FormatService.setFullDateFormat(field.created_at),
  },
  {
    name: 'createdBy',
    align: 'left',
    label: 'Creado por',
    sortable: false,
    field: (field) => field.createdByUser.name,
  },
];

const downloadPdfTicket = (id) => {
  getPdfTicket(id)
    .then(() => {
      const blob = dataURItoBlob(pdfTicket.value.content);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    })
    .catch(() =>
      notifyError('Ha ocurrido un error al intentar descargar el PDF.')
    );
};

const downloadFileInfo = (id) => {
  getDocument(id).then(() => {
    const blob = dataURItoBlob(fileInfo.value.data.content);
    const url = URL.createObjectURL(blob);
    //window.open(url, '_blank');
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.value.data.title;
    a.click();
  });
};

const dataURItoBlob = (dataURI) => {
    var byteString = atob(dataURI);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: 'application/octet-stream'});
};
</script>
