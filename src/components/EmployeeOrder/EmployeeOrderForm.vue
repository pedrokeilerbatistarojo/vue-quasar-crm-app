<template>
  <ValidationErrorsList :errors="validationsErrors" />
  <q-form @submit="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="form.date"
          label="Fecha *"
          type="date"
          stack-label
          :rules="[(val) => InputValidationService.required(val)]"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6 col-lg-4">
        <q-table
          flat
          bordered
          title="Especialistas"
          :rows="specialistsOrder"
          :columns="EmployeeOrderService.getColumnsTable()"
          :pagination="pagination"
          row-key="id"
          hide-bottom
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">{{ props.row.id }}</q-td>
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="order" :props="props">
                {{ props.row.order }}
                <q-popup-edit
                  v-slot="scope"
                  v-model="props.row.order"
                  title="Actualizar orden"
                  buttons
                >
                  <q-input
                    v-model="scope.value"
                    type="number"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <div>
      <PrimaryButton label="Guardar" type="submit" />
      <SecondaryButton
        class="q-ml-md"
        label="Cancelar"
        @click="$emit('cancel')"
      />
      <SecondaryButton
        v-if="isEditing"
        class="q-ml-md bg-red text-white"
        label="Eliminar orden"
        @click="confirmDelete"
      />
    </div>
  </q-form>
</template>

<script setup>
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import InputValidationService from '../../services/InputValidationService';
import { onMounted, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useEmployeeOrderStore } from 'stores/employeeOrder.js';
import { useEmployeeStore } from 'stores/employee.js';
import { useEmployeeTimeOffStore } from 'stores/employeeTimeOff.js';
import { storeToRefs } from 'pinia';
import ValidationErrorsList from '../Form/ValidationErrorsList.vue';
import EmployeeOrderService from 'src/services/EmployeeOrderService';

const props = defineProps({
  employeeOrder: Object,
});
const emit = defineEmits([
  'create:success',
  'update:success',
  'cancel',
  'deleted:success',
]);

const { error, validationsErrors } = storeToRefs(useEmployeeOrderStore());
const { employees } = storeToRefs(useEmployeeStore());
const { employeesTimeOff } = storeToRefs(useEmployeeTimeOffStore());
const { editEmployeeOrder, storeEmployeeOrder, deleteEmployeeOrder } =
  useEmployeeOrderStore();
const { fetchEmployees } = useEmployeeStore();
const { fetchEmployeesTimeOff } = useEmployeeTimeOffStore();
const $q = useQuasar();
const isEditing = ref(false);
const form = reactive({
  id: props.employeeOrder?.id,
  date: props.employeeOrder?.date,
  order: props.employeeOrder?.order,
});
const specialistsOrder = ref([]);
const pagination = ref({
  rowsPerPage: 1000,
  sortBy: 'order',
  descending: false,
});

onMounted(() => {
  if (props.employeeOrder.id) {
    isEditing.value = true;
    specialistsOrder.value = JSON.parse(props.employeeOrder.order);
  } else {
    fetchEmployeesTimeOff({
      date_from: form.date + ' 00:00:00',
      date_to: form.date + ' 23:59:59',
    }).then(() => {
      fetchEmployees({ is_specialist: true, paginate_size: 1000 }).then(() => {
        const timeOffCompleteDay = employeesTimeOff.value.filter(timeOff => timeOff.type === 'Día Completo')
        const result = employees.value.filter(employee => {
          let pass = true
          timeOffCompleteDay.map(objTimeOff =>  {
            if (objTimeOff.employee_id === employee.id) pass = false
          })
          return pass
        })
        let order = 0;
        specialistsOrder.value = result.map((item) => {
          order++;
          return {
            id: item.id,
            name: `${item.first_name} ${item.last_name ?? ''}`,
            order: order,
          };
        });
      });
    });
  }
});

const onSubmit = () => {
  mapSpecialistParseInt();
  specialistsOrder.value.sort((x, y) => x.order - y.order);
  form.order = JSON.stringify(specialistsOrder.value);

  if (isEditing.value) {
    return updateEmployeeOrder();
  }

  return createEmployeeOrder();
};

const updateEmployeeOrder = async () => {
  await editEmployeeOrder(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message:
          'Ha ocurrido un error al editar los datos del orden de empleados',
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
  });
};

const createEmployeeOrder = async () => {
  await storeEmployeeOrder(form).then(() => {
    if (error.value) {
      $q.notify({
        type: 'negative',
        message:
          'Ha ocurrido un error al intentar crear el registro para el orden de empleados',
      });
    } else {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Orden de empleados creado correctamente',
      });

      emit('create:success');
    }
  });
};

const mapSpecialistParseInt = () => {
  specialistsOrder.value.map((item) => {
    item.order = parseInt(item.order);
    return item;
  });
};

watch(specialistsOrder, () => {
  mapSpecialistParseInt();
});

const confirmDelete = () => {
  $q.dialog({
    title: 'Eliminar orden de especialistas',
    message:
      '¿Está seguro que desea eliminar este orden para esta fecha? La acción no podrá ser revertida.',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteEmployeeOrder(props.employeeOrder.id).then(() => {
        if (error.value === null) {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message:
              'Se ha eliminado el orden de especialistas para esta fecha correctamente',
          });

          emit('deleted:success');
        }
      });
    })
    .onCancel(() => {});
};
</script>
