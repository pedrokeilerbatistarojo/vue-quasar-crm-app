<template>
  <div>
    <SectionTitle>Nueva asociación</SectionTitle>
    <GymSubscriptionForm :client-id="clientId" @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import { useRouter } from 'vue-router';
import GymSubscriptionForm  from "components/GymSubscription/GymSubscriptionForm.vue";

const router = useRouter();

const props = defineProps({
  clientId: String,
});


</script>
