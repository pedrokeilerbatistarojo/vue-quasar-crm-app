<template>
  <TreatmentReservationEvent
    v-if="event.client"
    :event="event"
    :calendar-scope="calendarScope"
    calendar-type="daily"
  />
  <NoteEvent
    v-if="event.badge_type === 'note'"
    :event="event"
    :calendar-scope="calendarScope"
    calendar-type="daily"
    @click="$emit('edit-badge', event)"
  />

  <TimeOffEvent
    v-if="event.badge_type === 'time-off'"
    :event="event"
    :calendar-scope="calendarScope"
    calendar-type="daily"
    @click="$emit('edit-badge', event)"
  />
</template>

<script setup>
import TreatmentReservationEvent from 'src/components/Calendar/TreatmentReservationEvent.vue';
import NoteEvent from 'src/components/Calendar/NoteEvent.vue';
import TimeOffEvent from 'src/components/Calendar/TimeOffEvent.vue';

const props = defineProps({
  event: Object,
  calendarScope: Object,
});
const emit = defineEmits(['updated:success', 'edit-badge']);
</script>

<style scoped lang="sass">
.my-event
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.left-side
  left: 0
  width: calc(50% - 3px)

.right-side
  left: 50%
  width: calc(50% - 3px)

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%
</style>
