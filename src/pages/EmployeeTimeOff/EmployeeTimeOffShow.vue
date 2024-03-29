<template>
    <div v-if="employee" class="q-pa-md" style="max-width: 400px">

        <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
            <q-input
v-model="employee.name" filled label="Nombre" lazy-rules
                :rules="[val => val && val.length > 0 || 'Please type something']" />

            <q-input v-model="employee.last_name" filled label="Apellido" lazy-rules/>

            <q-toggle v-model="employee.active" label="Activo" />

            <div>
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
        </q-form>
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEmployeeStore } from 'stores/employee'

const props = defineProps({ id: Number })
const { employee, loading } = storeToRefs(useEmployeeStore())
const { fetchEmployee } = useEmployeeStore()
const $q = useQuasar()

const active = ref(employee.active)

fetchEmployee(props.id)

const onSubmit = () => {
    if (active.value !== true) {
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
        })
    }
    else {
        $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
        })
    }
}

const onReset = () => {
    fetchEmployee(props.id)
}
</script>
