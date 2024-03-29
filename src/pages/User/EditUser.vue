<template>
  <SectionTitle>Datos del usuario</SectionTitle>
  <p v-if="loading">Cargando datos del usuario...</p>
  <div v-if="!loading && user">
    <UserForm
      :user="user"
      @create:success="router.back()"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import SectionTitle from 'src/components/SectionTitle.vue';
import UserForm from 'src/components/User/UserForm.vue';
import { useUserStore } from 'stores/user.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const { user, loading } = storeToRefs(useUserStore());
const { fetchUser } = useUserStore();

fetchUser(props.id);
</script>
