import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { DateTime } from 'luxon';
import PaginationService from './../services/PaginationService.js';

export const useCircuitReservationStore = defineStore('circuitReservation', {
  state: () => ({
    circuitReservations: [],
    circuitReservationsWithTrashed: [],
    circuitReservationSummary: [],
    circuitReservation: null,
    lastDateSummaryFetched: null,
    schedulePdf: null,
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
    async fetchCircuitReservations(params = {}) {
      params.includes = 'client,orderDetails.order,product,createdByUser';
      this.circuitReservations = [];
      this.loading = true;
      await api
        .post('/api/circuit-reservations/search', params)
        .then((response) => {
          this.circuitReservations = response.data.data.records;

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

    async fetchCircuitReservationsWithTrashed(params = {}) {
      params.includes = 'client,orderDetails.order,product';
      params.deleted_at = true
      this.circuitReservationsWithTrashed = [];
      this.loading = true;
      await api
        .post('/api/circuit-reservations/search', params)
        .then((response) => {
          this.circuitReservationsWithTrashed = response.data.data.records;

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

    async fetchCircuitReservationSummary(date) {
      this.circuitReservationSummary = [];
      this.loading = true;

      await api
        .post('/api/circuit-reservations/summary', {
          date: DateTime.fromFormat(date, 'dd/MM/yyyy').toISODate(),
          includes: 'client,orderDetails.order',
          group_results: 'time,client_id',
        })
        .then((response) => {
          this.circuitReservationSummary = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.lastDateSummaryFetched = date;
          this.loading = false;
        });
    },

    async fetchCircuitReservation(id) {
      this.circuitReservation = null;
      this.loading = true;
      await api
        .get(`/api/circuit-reservations/${id}`, {
          params: { includes: 'client' },
        })
        .then((response) => {
          this.circuitReservation = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editCircuitReservation(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/circuit-reservations/update`, data)
        .then((response) => {
          this.circuitReservation = response.data.data;
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

    async storeCircuitReservation(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/circuit-reservations/create`, data)
        .then((response) => {
          this.circuitReservation = response.data.data;
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

    async deleteCircuitReservation(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/circuit-reservations/delete`, { params: { id: id } })
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

    async markAsUsedCircuitReservation(id) {
      this.error = null;
      this.validationsErrors = null;

      await api
        .patch(`/api/circuit-reservations/mark-as-used`, {
          id: id,
          used: 1,
        })
        .then(() => { })
        .catch((error) => {
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => { });
    },

    async fetchSchedulePdf(date) {
      this.schedulePdf = null;
      this.loading = true;
      await api
        .get(`/api/circuit-reservations/schedules-pdf/${date}`)
        .then((response) => {
          this.schedulePdf = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async sendReservationMail(params) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .post(`/api/circuit-reservations/send-email`, params)
        .then((response) => { })
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
