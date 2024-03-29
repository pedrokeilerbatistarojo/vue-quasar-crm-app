import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: JSON.parse(localStorage.getItem('token')),
    user: null,
    returnUrl: null,
    error: null,
    validationsErrors: null,
  }),
  actions: {
    async login(username, password) {
      this.error = null;
      const loginData = {
        username: username,
        password: password,
      };
      await api
        .post('/api/auth/login', loginData)
        .then((response) => {
          this.token = response.data;
          localStorage.setItem('token', JSON.stringify(this.token));
        })
        .catch((error) => {
          this.error = error;
        });
    },

    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      location.reload();
    },

    async fetchProfile() {
      await api
        .post('/api/auth/me?includes=defaultCompany')
        .then((response) => (this.user = response.data.data))
        .catch((error) => {
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        });
    },
  },
});
