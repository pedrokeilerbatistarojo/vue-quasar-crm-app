<template>
  <q-badge
    outline
    class="cursor-pointer"
    :style="getStyle(calendarScope, event)"
  >
    {{ event.note }}
  </q-badge>
</template>

<script setup>
import CalendarService from '../../services/CalendarService.js';

const props = defineProps({
  event: Object,
  calendarType: String,
  calendarScope: Object,
});

const getStyle = () => {
  const styles = CalendarService.getBasicStyles(
    props.event,
    props.calendarType,
    props.calendarScope
  );

  styles.background = '#2175DF';
  styles.color = 'white';

  return styles;
};
</script>
