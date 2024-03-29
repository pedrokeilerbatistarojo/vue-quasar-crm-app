<template>
    <div>
        <p v-if="loading">Cargando datos del cliente client...</p>
        Cliente
        <div v-if="client" class="q-pa-md">

            <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
                <div class="row">
                    <q-input
                        v-model="client.name" filled label="Nombre y apellidos*" lazy-rules
                        :rules="[val => InputValidationService.required(val)]" />
                    <q-input v-model="client.email" filled type="email" label="Email" :rules="['email']" required />
                    <q-input
                        v-model="client.document" filled type="text" label="Documento *" lazy-rules
                        :rules="[val => InputValidationService.required(val)]" />
                    <q-input
                        v-model="client.phone" filled type="text" label="Teléfono" lazy-rules
                        class="q-field--with-bottom" />
                    <q-input v-model="client.birthdate" filled type="date" label="Fecha de nacimiento" />
                    <q-input v-model="client.address" filled type="text" label="Dirección" />
                    <q-input
                        v-model="client.postcode" filled type="text" label="Código postal"
                        :rules="[val => InputValidationService.isPostalCode(val)]" />
                </div>
                <div>
                    <q-btn label="Guardar" type="submit" color="primary" />
                    <q-btn label="Ignorar cambios" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
            </q-form>

        </div>

        <pre>{{ client }}</pre>
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useClientStore } from 'stores/client.js'
import InputValidationService from '../../services/InputValidationService';

const props = defineProps({ id: Number })
const { client, loading } = storeToRefs(useClientStore())
const { fetchClient } = useClientStore()
const $q = useQuasar()

const onSubmit = () => {
    $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Cambios guardados correctamente'
    });
}

const onReset = () => {
    fetchClient(props.id)
}

fetchClient(props.id)
</script>

<style lang="scss" scoped>
</style>
