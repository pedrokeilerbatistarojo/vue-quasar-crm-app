import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useGymSubscriptionQuoteStore = defineStore('gymSubscriptionQuote', {
  state: () => ({
    gymSubscriptionQuotes: [],
    gymSubscriptionQuote: null,
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
    async fetchGymSubscriptionQuotes(params) {
      params.includes = 'createdByUser';
      this.gymSubscriptionQuotes = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/gym-subscription-quotas/search', params)
        .then((response) => {
          this.gymSubscriptionQuotes = response.data.data.records;
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

    async fetchGymSubscriptionQuote(id) {
      this.gymSubscriptionQuote = null;
      this.loading = true;
      await api
        .get(`/api/gym-subscription-quotas/${id}`)
        .then((response) => {
          this.gymSubscriptionQuote = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editGymSubscriptionQuote(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/gym-subscription-quotas/update`, data)
        .then((response) => {
          this.gymSubscriptionQuote = response.data.data;
        })
        .catch((error) => {
          console.log('edit gym subscription quotes error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async storeGymSubscriptionQuote(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/gym-subscription-quotas/create`, data)
        .then((response) => {
          this.gymSubscriptionQuote = response.data.data;
        })
        .catch((error) => {
          console.log('edit gym subscription quotes error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async deleteGymSubscriptionQuote(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/gym-subscription-quotas/delete`, { params: { id: id } })
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
