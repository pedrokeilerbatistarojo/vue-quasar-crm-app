import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import FormatService from 'src/services/FormatService';
import PaginationService from './../services/PaginationService.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    user: {},
    loading: false,
    error: null,
    validationsErrors: null,
    pdfTicket: null,
    pagination: {
      sortBy: null,
      descending: false,
      page: null,
      rowsPerPage: null,
      rowsNumber: null,
      next: null,
      prev: null,
    },
  }),
  actions: {
    async fetchUsers(params = {}) {
      this.users = [];
      this.loading = true;
      await api
        .post('/api/users/search', params)
        .then((response) => {
          this.users = response.data.data.records;

          if (response.data.data.meta?.pagination) {
            this.pagination = PaginationService.getPaginationData(
              response.data.data.meta.pagination
            );
          }
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async fetchUser(id) {
      this.user = {};
      this.loading = true;
      await api
        .get(`/api/users/${id}`)
        .then((response) => {
          this.user = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async storeUser(data) {
      this.user = null;
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .post(`/api/users/create`, data)
        .then((response) => {
          this.user = response.data.data;
        })
        .catch((error) => {
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async editUser(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      if (data.password === null || data.password === '') {
        delete data.password;
        delete data.password_confirmation;
      }

      await api
        .put(`/api/users/update`, data)
        .then((response) => {
          this.user = response.data.data;
        })
        .catch((error) => {
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async deleteUser(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/users/delete`, { params: { id: id } })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
