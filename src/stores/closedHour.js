import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from '../services/PaginationService.js';
import { DateTime } from 'luxon';

export const useClosedHourStore = defineStore('closedHour', {
  state: () => ({
    closedHours: [],
    closedHoursOnDate: null,
    loading: false,
    error: null,
    validationsErrors: null,
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
  getters: {

  },
  actions: {
    async fetchClosedHours(params) {
      this.closedHours = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/festives/search', params)
        .then((response) => {
          this.closedHours = response.data.data.records;

          if (response.data.data.meta?.pagination) {
            this.pagination = PaginationService.getPaginationData(
              response.data.data.meta.pagination
            );
          }
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async fetchClosedHoursOnDate(date) {
      this.closedHour = null;
      this.loading = true;
      await api
        .get(`/api/festives/${id}`, {
          params: { date: 'locality.province' },
        })
        .then((response) => {
          this.closedHour = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchClosedHourToForm(id) {
      this.loading = true;
      this.closedHourToForm = null;
      await api
        .get(`/api/closedHours/${id}`, {
          params: { includes: 'locality.province' },
        })
        .then((response) => {
          this.closedHourToForm = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editClosedHour(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/festives/update`, data)
        .then((response) => {
          this.closedHour = response.data.data;
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

    async storeClosedHour(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/festives/create`, data)
        .then((response) => {
          this.closedHour = response.data.data;
        })
        .catch((error) => {
          console.log('edit closedHour error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async deleteClosedHour(id) {
      this.loading = true;
      await api
        .delete('/api/festives/delete', { params: { id: id } })
        .then((response) => {
          this.fetchClosedHours();
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
