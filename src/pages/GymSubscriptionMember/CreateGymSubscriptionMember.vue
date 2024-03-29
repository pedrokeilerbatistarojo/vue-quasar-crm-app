<template>
  <div>
    <SectionTitle>Nuevo miembro</SectionTitle>
    <GymSubscriptionMemberForm :gym-subscription-id="props.gymSubscriptionId" @create:success="router.back()" @cancel="router.back()" />
  </div>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import { useRouter } from 'vue-router';
import GymSubscriptionMemberForm  from "components/GymSubscriptionMember/GymSubscriptionMemberForm.vue";

const router = useRouter();

const props = defineProps({
  gymSubscriptionId: String,
});


</script>
