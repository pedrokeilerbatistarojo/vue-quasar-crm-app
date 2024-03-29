<template>
  <div>
    <SectionTitle>Nueva quota</SectionTitle>
    <GymSubscriptionQuoteForm :gym-subscription-id="props.gymSubscriptionId" @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import { useRouter } from 'vue-router';
import GymSubscriptionQuoteForm  from "components/GymSubscriptionQuote/GymSubscriptionQuoteForm.vue";

const router = useRouter();

const props = defineProps({
  gymSubscriptionId: String,
});


</script>
