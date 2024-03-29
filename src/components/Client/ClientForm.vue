<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @keydown.enter.prevent @submit="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.name"
          autofocus
          label="Nombre y apellidos*"
          :rules="[(val) => InputValidationService.required(val)]"
          autocomplete="chrome-off"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.email"
          type="email"
          label="Email"
          autocomplete="chrome-off"
        />
      </div>
      <div class="col-12 col-md-2">
        <TextInput
          v-model="form.document"
          type="text"
          label="Documento"
          autocomplete="chrome-off"
        />
      </div>
      <div class="col-12 col-md-3">
        <TextInput
          v-model="form.phone"
          label="Teléfono"
          autocomplete="chrome-off"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="form.birthdate"
          dense
          stack-label
          type="date"
          label="Fecha de nacimiento"
          autocomplete="chrome-off"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <TextInput
          v-model="form.address"
          label="Dirección"
          autocomplete="chrome-off"
        />
      </div>
      <div class="col-12 col-md-2">
        <TextInput
          v-model="form.postcode"
          type="text"
          label="Código postal"
          autocomplete="chrome-off"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-if="localities"
          ref="selectLocalities"
          v-model="form.locality_id"
          dense
          use-input
          input-debounce="0"
          label="Localidad"
          :options="
            isSearchLocalities ? localityOptionsSelect : localityOptions
          "
          emit-value
          map-options
          option-label="label"
          option-value="value"
          clearable
          autocomplete="chrome-off"
          @filter="filterLocalities"
          @input-value="setModelLocality"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                CP sin localidades
                <SecondaryButton
                  class="q-mx-md q-my-md"
                  label="Nueva localidad"
                  @click="handleNewLocality"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="form.province"
          dense
          input-debounce="0"
          label="Provincia"
          :options="provincesOptions"
          emit-value
          clearable
          autocomplete="chrome-off"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="form.lopd_agree"
          :options="[
            {
              label: 'Pendiente',
              value: null,
            },
            {
              label: 'Firmada',
              value: true,
            },
            {
              label: 'NO DATOS',
              value: false,
            },
          ]"
          emit-value
          map-options
          dense
          label="LOPD"
          class="q-mb-md"
        >
        </q-select>
      </div>
    </div>
    <div class="q-mt-lg">
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
      />
      <SecondaryButton
        v-if="!isEditing && form.name"
        class="q-ml-md"
        label="Validar Existencia"
        @click="checkExistence()"
      />
    </div>
  </q-form>
  <br />
  <div v-if="duplicateList && !isEditing">
    <hr />
    <h5>Datos Coincidentes</h5>
    <DuplicatesClientTable editable viewable />
  </div>
</template>

<script setup>
import DuplicatesClientTable from 'src/components/Client/DuplicatesClientTable.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import { onMounted, reactive, ref, watch, onBeforeMount, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useClientStore } from 'stores/client.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import TextInput from '../Form/TextInput.vue';
import { useLocalityStore } from 'stores/locality';

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['create:success', 'update:success', 'cancel']);

const { client, duplicateList, error, loading, validationsErrors } =
  storeToRefs(useClientStore());
const { editClient, storeClient, getDuplicateList } = useClientStore();
const { localities, provinces, locality } = storeToRefs(useLocalityStore());
const { fetchLocalities, fetchProvinces, storeLocality } = useLocalityStore();

const $q = useQuasar();
const isEditing = ref(false);
const isSearchLocalities = ref(false);
const selectLocalities = ref(null);

const form = reactive({
  id: props.client?.id,
  name: props.client?.name,
  email: props.client?.email,
  document: props.client?.document,
  phone: props.client?.phone,
  address: props.client?.address,
  postcode: props.client?.postcode,
  locality_id: props.client?.locality_id?.toString(),
  province: props.client?.locality?.province.name,
  birthdate: props.client?.birthdate,
  lopd_agree: props.client?.lopd_agree,
  opt_in: true,
});

onBeforeMount(() => {
  if (props.client) {
    fetchLocalities({ zip_code: props.client.postcode, paginate_size: 200 });
  }
  fetchProvinces();
});

onMounted(() => {
  if (props.client) {
    isEditing.value = true;
  }
});

const localityOptions = computed(() =>
  localities.value.map((item) => ({
    label: item.population,
    value: item.id.toString(),
  }))
);

const localityOptionsSelect = ref(
  localities.value.map((item) => ({
    label: item.population,
    value: item.id.toString(),
  }))
);

const newLocality = ref(null);

const setModelLocality = (val) => {
  newLocality.value = val;
};

const handleNewLocality = async () => {
  if (!newLocality.value) {
    $q.notify({
      type: 'negative',
      message: 'Escriba un nombre de localidad',
    });
    return;
  }
  if (!form.province) {
    $q.notify({
      type: 'negative',
      message: 'Debe seleccionar una provincia antes de crear la localidad',
    });
    return;
  }

  const provinceId = provinces.value.find((province) => {
    return province.name === form.province;
  }).id;

  const localityData = {
    zip_code: form.postcode,
    locality: newLocality.value,
    singular_entity_name: newLocality.value,
    population_unit_code: form.postcode,
    population: newLocality.value,
    municipio_id: form.postcode,
    province_id: provinceId,
  };

  await storeLocality(localityData).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al intentar crear la localidad',
      });
    } else {
      fetchLocalities({
        zip_code: form.postcode,
        includes: 'province',
        paginate_size: 1000,
      }).then(() => {
        const localityObject = {
          label: locality.value.singular_entity_name,
          value: locality.value.id.toString(),
        };
        localityOptionsSelect.value.push(localityObject);
        form.locality_id = localityObject.value;
        selectLocalities.value.hidePopup();
        selectLocalities.value.updateInputValue(null, true);
      });
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Localidad creada correctamente',
      });
    }
  });
};

const filterLocalities = (val, update, abort) => {
  update(() => {
    isSearchLocalities.value = true;
    const needle = val.toLowerCase();
    localityOptionsSelect.value = localityOptions.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const provincesOptions = computed(() =>
  provinces.value.map((item) => item.name)
);

watch(
  () => form.postcode,
  (value) => {
    if (value.length === 5) {
      fetchLocalities({
        zip_code: form.postcode,
        includes: 'province',
        paginate_size: 1000,
      }).then(() => {
        if (localities.value.length === 1) {
          form.locality_id = localities.value[0].id.toString();
        } else {
          form.locality_id = null;
        }
        form.province = provinces.value.find(
          (item) => item.id == value.substring(0, 2)
        ).name;
        isSearchLocalities.value = false;
      });
    }
  }
);

const onSubmit = () => {
  if (isEditing.value) {
    return updateClient();
  }
  isSearchLocalities.value = false;
  return createClient();
};

const updateClient = async () => {
  await editClient(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: 'Ha ocurrido un error al editar los datos del cliente',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Cambios guardados correctamente',
      });

      emit('update:success');
    }
    isSearchLocalities.value = false;
  });
};

const createClient = async () => {
  await storeClient(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message:
          'Ha ocurrido un error al intentar crear el registro para el cliente',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Cliente creado correctamente',
      });

      emit('create:success', client);
    }
    isSearchLocalities.value = false;
  });
};

const checkExistence = () => {
  let params = {};
  Object.keys(form).map((element) => {
    if (form[element] && form[element].length > 0)
      params[element] = form[element];
  });
  getDuplicateList(params)
    .then(() => {
      if (duplicateList.value.length > 0) {
      } else {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message:
            'No se ha encontrado ningún registro que sugiera la duplicidad del cliente',
        });
      }
    })
    .catch((error) => {
      console.error(error);
      $q.notify({
        type: 'negative',
        message:
          'Ha ocurrido un error comprobando la duplicidad del nuevo cliente',
      });
    });
};
</script>
