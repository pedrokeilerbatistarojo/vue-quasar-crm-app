import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { DateTime } from 'luxon';
import PaginationService from './../services/PaginationService.js';

export const useTreatmentReservationStore = defineStore(
  'treatmentReservation',
  {
    state: () => ({
      treatmentReservations: [],
      treatmentReservationsByEmployee: [],
      treatmentReservationSummary: [],
      treatmentReservationsWithTrashed: [],
      treatmentReservation: null,
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
    getters: {},
    actions: {
      async fetchTreatmentReservations(params = {}) {
        params.includes = 'client,orderDetails.order,employee,product';
        this.treatmentReservations = [];
        this.loading = true;
        await api
          .post('/api/treatment-reservations/search', params)
          .then((response) => {
            this.treatmentReservations = response.data.data.records;

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
      async fetchTreatmentReservationsByEmployee(employeeId, date) {
        this.treatmentReservationsByEmployee = [];
        await api
          .post('/api/treatment-reservations/search', {
            date: date,
            employee_id: employeeId,
            paginate_size: 1000,
          })
          .then((response) => {
            this.treatmentReservationsByEmployee = response.data.data.records;
          })
          .catch((error) => (this.error = error))
          .finally(() => {
          });
      },
      async fetchTreatmentReservationsWithTrashed(params = {}) {
        params.includes = 'client,orderDetails.order,employee,product';
        params.deleted_at = true
        this.treatmentReservationsWithTrashed = [];
        this.loading = true;
        await api
          .post('/api/treatment-reservations/search', params)
          .then((response) => {
            this.treatmentReservationsWithTrashed = response.data.data.records;

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
      async fetchTreatmentReservationSummary(params = {}) {
        this.treatmentReservationSummary = [];
        this.loading = true;

        await api
          .post('/api/treatment-reservations/summary', params)
          .then((response) => {
            this.treatmentReservationSummary = response.data.data;
          })
          .catch((error) => (this.error = error))
          .finally(() => {
            this.lastDateSummaryFetched = params.date;
            this.loading = false;
          });
      },

      async fetchTreatmentReservation(id) {
        this.treatmentReservation = null;
        this.loading = true;
        await api
          .get(`/api/treatment-reservations/${id}`, {
            params: {
              includes: 'client,orderDetails,order,employee,product',
            },
          })
          .then((response) => {
            this.treatmentReservation = response.data.data;
          })
          .catch((error) => (this.error = error))
          .finally(() => {
            this.loading = false;
          });
      },
      async editTreatmentReservation(data) {
        this.loading = true;
        this.error = null;
        this.validationsErrors = null;

        await api
          .put(`/api/treatment-reservations/update`, data)
          .then((response) => {
            this.treatmentReservation = response.data.data;
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
      async storeTreatmentReservation(data) {
        this.loading = true;
        this.error = null;
        this.validationsErrors = null;

        await api
          .post(`/api/treatment-reservations/create`, data)
          .then((response) => {
            this.treatmentReservation = response.data.data;
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
      async deleteTreatmentReservation(id) {
        this.loading = true;
        this.error = null;
        this.validationsErrors = null;

        await api
          .delete(`/api/treatment-reservations/delete`, { params: { id: id } })
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
      async fetchSchedulePdf(date) {
        this.schedulePdf = null;
        this.loading = true;
        await api
          .get(`/api/treatment-reservations/schedules-pdf/${date}`)
          .then((response) => {
            this.schedulePdf = response.data.data;
          })
          .catch((error) => (this.error = error))
          .finally(() => {
            this.loading = false;
          });
      },
      async sendTreatmentReservationMail(params) {
        this.loading = true;
        this.validationsErrors = null;
        this.error = null;

        await api
          .post(`/api/treatment-reservations/send-email`, params)
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
  }
);
