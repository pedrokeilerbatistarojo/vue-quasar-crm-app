import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
    payment: null,
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
  actions: {
    async fetchPayments(params) {
      params.includes = 'order,createdByUser';
      this.payments = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/payments/search', params)
        .then((response) => {
          this.payments = response.data.data.records;

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

    async fetchPayment(id) {
      this.payment = null;
      this.loading = true;
      await api
        .get(`/api/payments/${id}`)
        .then((response) => {
          this.payment = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editPayment(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/payments/update`, data)
        .then((response) => {
          this.payment = response.data.data;
        })
        .catch((error) => {
          console.log('edit payment error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async storePayment(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/payments/create`, data)
        .then((response) => {
          this.payment = response.data.data;
        })
        .catch((error) => {
          console.log('edit payment error ', error);
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
