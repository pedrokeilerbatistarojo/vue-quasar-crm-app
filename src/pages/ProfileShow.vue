<template>
  <SectionTitle>Mi perfil</SectionTitle>
  <ValidationErrorsList :errors="validationsErrors" />
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
import ValidationErrorsList from 'src/components/Form/ValidationErrorsList.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import UserForm from 'src/components/User/UserForm.vue';
import { useAuthStore } from 'src/stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { fetchProfile, loading } = useAuthStore();
const { user, validationsErrors } = storeToRefs(useAuthStore());

onMounted(() => fetchProfile());
</script>
