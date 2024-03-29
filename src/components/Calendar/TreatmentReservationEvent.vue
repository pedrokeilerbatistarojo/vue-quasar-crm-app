<template>
  <div
    class="q-pa-sm"
    style="border-radius: 4px"
    :style="getStyle()"
    :class="{ 'event-used': event.used }"
  >
    <div
      v-if="!SystemService.isTelephoneOrCounterSale(event.client.id)"
      class="cursor-pointer"
      @click="showClient(event.client.id)"
    >
      {{ [event.client.name].join(' ') }}
      <template v-if="event.client.phone">
        <br />
        {{ event.client.phone }}
      </template>
      <br />
    </div>
    <div v-else>
      <div v-if="event.orderDetails[0].order.telephone_sale_seq">
        VT {{ event.orderDetails[0].order.telephone_sale_seq }}
      </div>
      <div v-if="event.orderDetails[0].order.counter_sale_seq">
        CH {{ event.orderDetails[0].order.counter_sale_seq }}
      </div>
    </div>
    <div class="cursor-pointer" @click="editReservation(event.id)">
      {{ event.notes || 'Evento de tratamiento' }}
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import SystemService from '../../services/SystemService.js';
import CalendarService from '../../services/CalendarService.js';

const props = defineProps({
  calendarType: {
    type: String,
    required: true,
  },
  event: Object,
  calendarScope: Object,
});

const router = useRouter();

const editReservation = (eventId) => {
  router.push({
    name: 'treatment-reservations.edit',
    params: { id: eventId },
  });
};

const showClient = (clientId) => {
  router.push({
    name: 'clients.show',
    params: { id: clientId },
  });
};

const getStyle = () => {
  const styles = CalendarService.getBasicStyles(
    props.event,
    props.calendarType,
    props.calendarScope
  );

  if (props.event.client_id && props.event.orderDetails) {
    styles.background =
      props.event.orderDetails[0].product.productType.background_color;
    styles.color = props.event.orderDetails[0].product.productType.text_color;
  }

  return styles;
};
</script>

<style scoped>
.event-used {
  opacity: 0.7;
}
</style>
