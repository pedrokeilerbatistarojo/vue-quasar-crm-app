import { boot } from "quasar/wrappers";
import axios from "axios";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

const env = import.meta.env;
const api = axios.create({ baseURL: env.VITE_API_BASE_URL });

export default boot(({ app, router }) => {
  const { token } = storeToRefs(useAuthStore());

  api.interceptors.request.use(
    (config) => {
      let localToken = JSON.parse(localStorage.getItem("token"));

      if (localToken) {
        config.headers["Authorization"] = `Bearer ${localToken.access_token}`;
      } else {
        config.headers["Authorization"] = null;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        token.value = null;
        localStorage.removeItem("token");
        const loginPath = "/login?redirect=" + router.currentRoute.value.path;

        router.push(loginPath);
      }

      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
