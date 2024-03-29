import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useDiscountStore = defineStore('discount', {
  state: () => ({
    discounts: [],
    discount: null,
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
    async fetchDiscounts(params = {}) {
      this.discounts = [];
      this.loading = true;
      await api
        .post('/api/discounts/search', params)
        .then((response) => {
          this.discounts = response.data.data.records;

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

    async fetchDiscount(id) {
      this.discount = null;
      this.loading = true;
      await api
        .get(`/api/discounts/${id}`)
        .then((response) => {
          this.discount = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editDiscount(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/discounts/update`, data)
        .then((response) => {
          this.discount = response.data.data;
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

    async storeDiscount(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/discounts/create`, data)
        .then((response) => {
          this.discount = response.data.data;
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
