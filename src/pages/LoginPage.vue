<template>
  <div class="row items-center login-wrapper">
    <div class="col-12 justify-center flex content-center">
      <q-card :style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }">
        <q-card-section>
          <q-avatar size="103px" class="absolute-center shadow-10">
            <img src="~assets/avatar.jpg" alt="avatar" />
          </q-avatar>
        </q-card-section>
        <br />
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col ellipsis flex justify-center">
              <img
                src="~assets/logo-thermas.svg"
                class="responsive"
                alt="login-image"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pb-xl q-px-xl">
          <q-form @submit.prevent="sendLogin">
            <div class="q-gutter-md">
              <q-input
                v-model="loginData.username"
                label="Nombre de usuario"
              ></q-input>
              <q-input
                v-model="loginData.password"
                label="Password"
                type="password"
              ></q-input>
            </div>

            <div v-if="!loading">
              <q-btn
                class="full-width q-mt-xl"
                color="secondary"
                label="INICIAR SESIÓN"
                type="submit"
                rounded
              >
              </q-btn>
            </div>
            <div v-else class="q-pa-md">
              <q-linear-progress indeterminate></q-linear-progress>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import LoginBackground from 'src/assets/balneario.jpg';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const loginData = reactive({
  username: '',
  password: '',
});
const loading = ref(false);
const { login } = useAuthStore();
const { error } = storeToRefs(useAuthStore());

const backgroundImage = `url(${LoginBackground})`;

const sendLogin = async () => {
  loading.value = true;

  if (!loginData.username || !loginData.password) {
    $q.notify({
      type: 'negative',
      message: 'Debe llenar todos los campos',
    });

    loading.value = false;
  } else {
    await login(loginData.username, loginData.password)
      .then(() => {
        if (error.value) {
          if (error.value.response && error.value.response.status === 401) {
            $q.notify({
              type: 'negative',
              message: 'Credenciales no válidas',
            });
          } else {
            console.log(error);
            $q.notify({
              type: 'negative',
              message: 'Error desconocido',
            });
          }
        } else {
          let redirectPath = route.query.redirect || '/';

          if (redirectPath === '/login') {
            redirectPath = '/';
          }

          router.push({ path: redirectPath, hash: '#login' });
        }
      })
      .finally(() => (loading.value = false));
  }
};
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
}

.login-wrapper::before {
  content: '';
  background-image: v-bind(backgroundImage);
  background-size: cover;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 0.54;
}
</style>
