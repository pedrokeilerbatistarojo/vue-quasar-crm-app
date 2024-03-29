<template>
  <q-calendar-day
    ref="calendar"
    v-model="calendarDate"
    :view="selectedView"
    hour24-format
    bordered
    animated
    :interval-minutes="30"
    :interval-start="15"
    :interval-count="32"
    :interval-height="28"
    locale="es"
    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    @change="onChange"
    @click-time="onClickTime"
    @click-head-day="onClickHeadDay"
  >
    <template v-if="showEvents" #day-body="{ scope }">
      <template v-for="event in events[scope.timestamp.date]" :key="event.id">
        <CalendarBadge
          :event="event"
          :calendar-scope="scope"
          @edit-badge="editBadgeEvent(event)"
        />
      </template>
    </template>
  </q-calendar-day>
  <CreateEmployeeTimeOffDialog
    v-model="showCreateEmployeeTimeOffDialog"
    :employee-time-off="employeeTimeOffDTO"
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
import {
  QCalendarDay,
  today,
  addToDate,
  parsed,
  parseTime,
  isBetweenDates,
} from '@quasar/quasar-ui-qcalendar/src/index.js';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass';
import CalendarBadge from 'src/components/Reservation/CalendarBadge.vue';
import { useTreatmentReservationStore } from 'src/stores/treatmentReservation';
import { useEmployeeStore } from 'src/stores/employee';
import { storeToRefs } from 'pinia';
import { reactive, computed, ref, watch } from 'vue';
import { DateTime } from 'luxon';
import CreateTreatmentScheduleNoteDialog from 'src/components/TreatmentScheduleNote/CreateTreatmentScheduleNoteDialog.vue';
import CreateEmployeeTimeOffDialog from 'src/components/Employee/CreateEmployeeTimeOffDialog.vue';
import { useTreatmentScheduleNoteStore } from 'stores/treatmentScheduleNote';
import { useEmployeeTimeOffStore } from 'src/stores/employeeTimeOff.js';
import DateService from 'src/services/DateService';
import InputValidationService from 'src/services/InputValidationService';

const props = defineProps({
  selectedDate: String,
  employeeId: Number,
  selectedView: {
    type: String,
    default: 'day',
  },
});
const emit = defineEmits(['updated:success']);

const { fetchTreatmentReservationSummary } = useTreatmentReservationStore();
const { treatmentReservationSummary, loading } = storeToRefs(
  useTreatmentReservationStore()
);
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
const { fetchEmployee } = useEmployeeStore();

const showCreateTreatmentScheduleNoteDialog = ref(false);
const showCreateEmployeeTimeOffDialog = ref(false);
const treatmentScheduleNoteDTO = ref(null);
const employeeTimeOffDTO = ref(null);
const calendar = ref(null);
const currentWeek = reactive({});
const showTreatmentReservationForm = ref(false);
const showEvents = ref(false);
const events = ref([]);

const calendarDate = computed(() =>
  DateTime.fromFormat(props.selectedDate, 'dd/MM/yyyy').toFormat('yyyy-MM-dd')
);

const onToday = () => {
  this.$refs.calendar.moveToToday();
};
const onPrev = () => {
  this.$refs.calendar.prev();
};
const onNext = () => {
  this.$refs.calendar.next();
};

const onMoved = (data) => {
  console.log('onMoved', data);
};

const onChange = (data) => {
  currentWeek.data = data;
  console.log('ini change');
  fillEvents();
  console.log('onChange', data);
};

const onClickHeadDay = (data) => {
  console.log('onClickHeadDay', data);
};
const onClickTime = (data) => {
  showTreatmentReservationForm.value = true;
  console.log('onClickTime', data);
  fillNoteDTO({
    date: data.scope.timestamp.date,
    from_hour: data.scope.timestamp.time,
    employee_id: props.employeeId,
  });
};
const fillNoteDTO = (data) => {
  treatmentScheduleNoteDTO.value = data;
  showCreateTreatmentScheduleNoteDialog.value = true;
};

const fillEvents = async () => {
  if (props.employeeId) {
    const date = DateTime.fromFormat(
      props.selectedDate,
      'dd/MM/yyyy'
    ).toISODate();

    console.log(currentWeek.data.start);

    await fetchTreatmentReservationSummary({
      employee_id: props.employeeId,
      date_from: currentWeek.data.start + ' 00:00:00',
      date_to: currentWeek.data.end + ' 23:59:59',
      group_results: 'date',
      includes: 'client,orderDetails.product.productType,orderDetails.order',
    });

    await fetchTreatmentScheduleNotes({
      date_from: currentWeek.data.start + ' 00:00:00',
      date_to: currentWeek.data.end + ' 23:59:59',
      employee_id: props.employeeId,
    });
    await fetchEmployeesTimeOff({
      from_date_from: currentWeek.data.start + ' 00:00:00',
      from_date_to: currentWeek.data.end + ' 23:59:59',
      employee_id: props.employeeId,
    });

    events.value = treatmentReservationSummary.value || [];

    for (const timeOff of employeesTimeOff.value) {
      const from = DateService.createDate(timeOff.from_date);
      const to = DateService.createDate(timeOff.to_date);
      const key = from.toFormat('yyyy-MM-dd');

      events.value[key] = events.value[key] || [];

      events.value[key].push({
        time_off_id: timeOff.id,
        duration: DateService.getMinutesBetweenDates(from, to),
        time: from.toFormat('HH:mm'),
        badge_type: 'time-off',
      });
    }

    for (const note of treatmentScheduleNotes.value) {
      const from = DateService.createDate(note.date + ' ' + note.from_hour);
      const to = DateService.createDate(note.date + ' ' + note.to_hour);
      const key = from.toFormat('yyyy-MM-dd');

      events.value[key] = events.value[key] || [];

      events.value[key].push({
        note_id: note.id,
        duration: DateService.getMinutesBetweenDates(from, to),
        time: from,
        badge_type: 'note',
        note: note.note,
      });
    }

    // if (events.length === 1) {
    //   events[0].side = 'full';
    // } else if (events.length === 2) {
    //   // this example does no more than 2 events per day
    //   // check if the two events overlap and if so, select
    //   // left or right side alignment to prevent overlap
    //   const startTime = addToDate(parsed(events[0].date), {
    //     minute: parseTime(events[0].time),
    //   });
    //   const endTime = addToDate(startTime, { minute: events[0].duration });
    //   const startTime2 = addToDate(parsed(events[1].date), {
    //     minute: parseTime(events[1].time),
    //   });
    //   const endTime2 = addToDate(startTime2, { minute: events[1].duration });
    //   if (
    //     isBetweenDates(startTime2, startTime, endTime, true) ||
    //     isBetweenDates(endTime2, startTime, endTime, true)
    //   ) {
    //     events[0].side = 'left';
    //     events[1].side = 'right';
    //   } else {
    //     events[0].side = 'full';
    //     events[1].side = 'full';
    //   }
    // }

    showEvents.value = true;
  }
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
</script>
