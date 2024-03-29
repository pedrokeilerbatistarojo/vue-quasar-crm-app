<template>
  <SectionTitle>Agenda de Tratamientos</SectionTitle>
  <div class="full-width row justify-center">
    <q-input
      v-model="selectedDate"
      filled
      :rules="[(v) => InputValidationService.isHumanReadableFormat(v)]"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDate" mask="DD/MM/YYYY">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Aceptar" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <div class="q-ml-md q-pt-sm">
      <q-icon
        class="cursor-pointer text-primary"
        name="print"
        size="md"
        @click="getTreatmentReservation"
        ><q-tooltip max-width="14rem" anchor="top middle" self="bottom middle">
          Imprimir
        </q-tooltip></q-icon
      >
    </div>
  </div>

  <div v-if="calendarDate" class="row justify-center">
    <div style="display: flex; width: 100%">
      <q-calendar-resource
        ref="calendar"
        v-model="calendarDate"
        v-model:model-resources="resources"
        resource-key="id"
        :style="{ '--calendar-resources-width': '170px' }"
        resource-label="name"
        :interval-minutes="60 * intervalRangeStep"
        :interval-start="intervalStart"
        :interval-count="intervalCount"
        animated
        bordered
        hour24-format
        resource-min-height="120"
        cell-width="150"
        hoverable
        @change="onChange"
        @moved="onMoved"
        @resource-expanded="onResourceExpanded"
        @click-date="onClickDate"
        @click-time="onClickTime"
        @click-resource="onClickResource"
        @click-head-resources="onClickHeadResources"
        @click-interval="onClickInterval"
      >
        <template #head-resources>
          <div class="text-bronze cursor-pointer text-center">
            Configurar orden
          </div>
        </template>
        <template #resource-label="{ scope: { resource } }">
          <div class="col-12">
            <q-chip class="cursor-pointer">
              <q-avatar>
                <q-icon name="face" />
              </q-avatar>
              {{ resource.first_name }} {{ resource.last_name }}
            </q-chip>
          </div>
        </template>
        <template #resource-intervals="{ scope }">
          <template v-if="events && scope.resource.id in events">
            <div style="background-color: black">
              <template
                v-for="(event, index) in events[scope.resource.id]"
                :key="index"
              >
                <TreatmentReservationEvent
                  v-if="event.client"
                  :event="event"
                  :calendar-scope="scope"
                  calendar-type="resource"
                />
                <NoteEvent
                  v-if="event.badge_type === 'note'"
                  :event="event"
                  :calendar-scope="scope"
                  calendar-type="resource"
                  @click="editBadgeEvent(event)"
                />

                <TimeOffEvent
                  v-if="event.badge_type === 'time-off'"
                  :event="event"
                  :calendar-scope="scope"
                  calendar-type="resource"
                  @click="editBadgeEvent(event)"
                />
              </template>
            </div>
          </template>
        </template>
      </q-calendar-resource>
    </div>
  </div>
  <CreateEmployeeTimeOffDialog
    v-model="showCreateEmployeeTimeOffDialog"
    :employee-time-off="employeeTimeOffDTO"
    :employee="employee"
    @event:success="
      showCreateEmployeeTimeOffDialog = false;
      fillEvents();
    "
    @event:update="
      showCreateEmployeeTimeOffDialog = false;
      fillEvents();
    "
    @cancel="showCreateEmployeeTimeOffDialog = false"
  />

  <CreateTreatmentScheduleNoteDialog
    v-model="showCreateTreatmentScheduleNoteDialog"
    :treatment-schedule-note="treatmentScheduleNoteDTO"
    @event:success="
      showCreateTreatmentScheduleNoteDialog = false;
      fillEvents();
    "
    @event:update="
      showCreateTreatmentScheduleNoteDialog = false;
      fillEvents();
    "
    @cancel="showCreateTreatmentScheduleNoteDialog = false"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import InputValidationService from '../../services/InputValidationService';
import DateService from '../../services/DateService';
import { useTreatmentReservationStore } from 'stores/treatmentReservation';
import { useEmployeeStore } from 'src/stores/employee';
import { useEmployeeTimeOffStore } from 'src/stores/employeeTimeOff.js';
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/src/index.js';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendar.sass';
import SectionTitle from 'src/components/SectionTitle.vue';
import { usePdfUtils } from 'src/composables/pdfUtils';
import { useErrorNotification } from 'src/composables/errorNotification';
import { useSuccessNotification } from 'src/composables/successNotification';
import CreateTreatmentScheduleNoteDialog from 'src/components/TreatmentScheduleNote/CreateTreatmentScheduleNoteDialog.vue';
import CreateEmployeeTimeOffDialog from 'src/components/Employee/CreateEmployeeTimeOffDialog.vue';
import { useTreatmentScheduleNoteStore } from 'stores/treatmentScheduleNote';
import { useEmployeeOrderStore } from 'stores/employeeOrder.js';
import TreatmentReservationEvent from 'src/components/Calendar/TreatmentReservationEvent.vue';
import NoteEvent from 'src/components/Calendar/NoteEvent.vue';
import TimeOffEvent from 'src/components/Calendar/TimeOffEvent.vue';

const router = useRouter();

const { lastDateSummaryFetched, treatmentReservationSummary, schedulePdf } =
  storeToRefs(useTreatmentReservationStore());

const { fetchTreatmentReservationSummary, fetchSchedulePdf } =
  useTreatmentReservationStore();
const { employees, employee } = storeToRefs(useEmployeeStore());
const { fetchEmployees, fetchEmployee } = useEmployeeStore();
const { fetchEmployeesTimeOff, fetchEmployeeTimeOff } =
  useEmployeeTimeOffStore();
const { employeesTimeOff, employeeTimeOff } = storeToRefs(
  useEmployeeTimeOffStore()
);
const {
  treatmentScheduleNotes,
  treatmentScheduleNote,
  loading: notesLoading,
} = storeToRefs(useTreatmentScheduleNoteStore());
const { fetchTreatmentScheduleNotes, fetchTreatmentScheduleNote } =
  useTreatmentScheduleNoteStore();
const { employeesOrder } = storeToRefs(useEmployeeOrderStore());
const { fetchEmployeesOrder } = useEmployeeOrderStore();

const selectedDate = ref();
const { dataURItoBlob } = usePdfUtils();
const { notifyError } = useErrorNotification();
const { notifySuccess } = useSuccessNotification();
const showCreateTreatmentScheduleNoteDialog = ref(false);
const showCreateEmployeeTimeOffDialog = ref(false);
const treatmentScheduleNoteDTO = ref(null);
const employeeTimeOffDTO = ref(null);
const calendar = ref(null);
const timeOffCompletedDay = ref([]);
const timeOffHourDay = ref([]);

const resources = computed(() => {
  const timeOffCompleteDay = timeOffCompletedDay.value.filter(
    (timeOff) => timeOff.type === 'Día Completo'
  );

  const result = employees.value.filter((employee) => {
    let pass = true;
    timeOffCompleteDay.map((objTimeOff) => {
      if (objTimeOff.employee_id === employee.id) pass = false;
    });
    return pass;
  });
  if (employeesOrder.value.length > 0) {
    let arrEmployees = [];
    const empOrder = employeesOrder.value[0];
    const order = JSON.parse(empOrder.order);
    order.map((obj) => {
      const objResource = result.find((emp) => emp.id === obj.id);
      if (objResource) arrEmployees.push(objResource);
    });
    return arrEmployees;
  }

  return result;
});

const events = ref([]);

const fillEvents = async () => {
  const date = DateTime.fromFormat(
    selectedDate.value,
    'dd/MM/yyyy'
  ).toISODate();

  await fetchTreatmentReservationSummary({
    date: date,
    includes: 'client,orderDetails.product.productType,orderDetails.order',
    group_results: 'employee_id',
  });

  await fetchTreatmentScheduleNotes({
    date_from: date + ' 00:00:00',
    date_to: date + ' 23:59:59',
  });

  await fetchEmployeesTimeOff({
    date_from: date + ' 00:00:00',
    date_to: date + ' 23:59:59',
  }).then(() => {
    timeOffCompletedDay.value = employeesTimeOff.value
  })

  await fetchEmployeesTimeOff({
    from_date_from: date + ' 00:00:00',
    from_date_to: date + ' 23:59:59',
  }).then(()=>{
    timeOffHourDay.value = employeesTimeOff.value
    events.value = treatmentReservationSummary.value;

    for (const resource of resources.value) {
      if (events.value[resource.id] === undefined) {
        events.value[resource.id] = [];
      }

      const currentEmployeeTimeOff = timeOffHourDay.value.filter(
        (item) => item.employee_id === resource.id
      );

      for (const timeOff of currentEmployeeTimeOff) {
        const from = DateService.createDate(timeOff.from_date);
        const to = DateService.createDate(timeOff.to_date);

        events.value[resource.id].push({
          time_off_id: timeOff.id,
          duration: DateService.getMinutesBetweenDates(from, to),
          time: from,
          badge_type: 'time-off',
        });
      }

      const currentEmployeeNotes = treatmentScheduleNotes.value.filter(
        (item) => item.employee_id === resource.id
      );

      for (const note of currentEmployeeNotes) {
        const from = DateService.createDate(note.date + ' ' + note.from_hour);
        const to = DateService.createDate(note.date + ' ' + note.to_hour);

        events.value[resource.id].push({
          note_id: note.id,
          duration: DateService.getMinutesBetweenDates(from, to),
          time: from,
          badge_type: 'note',
          note: note.note,
        });
      }
    }
  });
};

const intervalRange = reactive({ min: 9, max: 22 });
const intervalRangeStep = ref(0.5);

const calendarDate = computed(() =>
  DateTime.fromFormat(selectedDate.value, 'dd/MM/yyyy').toFormat('yyyy-MM-dd')
);
const intervalStart = computed(
  () => intervalRange.min * (1 / intervalRangeStep.value)
);
const intervalCount = computed(
  () => (intervalRange.max - intervalRange.min) * (1 / intervalRangeStep.value)
);

fetchEmployees({ is_specialist: true, paginate_size: 100 });

watch(selectedDate, (selectedDate) => {
  console.log(calendarDate.value);
  if (InputValidationService.isHumanReadableFormat(selectedDate)) {
    fillEvents();
    fetchEmployeesOrder({ date: calendarDate.value });
  }
});

if (lastDateSummaryFetched.value) {
  console.log(lastDateSummaryFetched.value);
  selectedDate.value = DateTime.fromFormat(
    lastDateSummaryFetched.value,
    'yyyy-MM-dd'
  ).toFormat('dd/MM/yyyy');
} else {
  selectedDate.value = DateTime.now().toFormat('dd/MM/yyyy');
}

const onMoved = (data) => {
  console.log('onMoved', data);
};
const onChange = (data) => {
  console.log('onChange', data);
};
const onResourceExpanded = (data) => {
  console.log('onResourceExpanded', data);
};
const onClickDate = (data) => {
  console.log('onClickDate', data);
};
const onClickTime = (data) => {
  fillNoteDTO({
    date: data.scope.timestamp.date,
    from_hour: data.scope.timestamp.time,
    employee_id: data.scope.resource.id,
  });
};

const fillNoteDTO = (data) => {
  treatmentScheduleNoteDTO.value = data;
  showCreateTreatmentScheduleNoteDialog.value = true;
};

const editBadgeEvent = (eventData) => {
  if (eventData.badge_type === 'time-off') {
    fetchEmployeeTimeOff(eventData.time_off_id).then(() => {
      fetchEmployee(employeeTimeOff.value.employee_id).then(() => {
        employeeTimeOffDTO.value = employeeTimeOff.value;
        showCreateEmployeeTimeOffDialog.value = true;
      });
    });
  }

  if (eventData.badge_type === 'note') {
    fetchTreatmentScheduleNote(eventData.note_id).then(() => {
      fillNoteDTO(treatmentScheduleNote.value);
    });
  }
};

const onClickResource = (data) => {
  router.push({
    name: 'treatment-reservations.by-employee',
    params: { id: data.scope.resource.id },
  });
};

const onClickHeadResources = (data) => {
  router.push({
    name: 'employeesOrder.create',
    params: { date: data.scope.date },
  });
};

const onClickInterval = (data) => {
  console.log('onClickInterval', data);
};

const getTreatmentReservation = () => {
  fetchSchedulePdf(
    DateTime.fromFormat(selectedDate.value, 'dd/MM/yyyy').toISODate()
  )
    .then(() => {
      const blob = dataURItoBlob(schedulePdf.value.content);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    })
    .catch(() =>
      notifyError('Ha ocurrido un error al intentar descargar el PDF.')
    );
};
</script>
