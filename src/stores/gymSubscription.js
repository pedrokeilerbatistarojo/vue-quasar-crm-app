import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useGymSubscriptionStore = defineStore('gymSubscription', {
  state: () => ({
    gymSubscriptions: [],
    gymSubscription: null,
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
    async fetchGymSubscriptions(params) {
      params.includes = 'order,client,createdByUser';
      this.gymSubscriptions = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/gym-subscriptions/search', params)
        .then((response) => {
          this.gymSubscriptions = response.data.data.records;

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

    async fetchGymSubscription(id) {
      this.gymSubscription = null;
      this.loading = true;
      await api
        .get(`/api/gym-subscriptions/${id}`)
        .then((response) => {
          this.gymSubscription = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editGymSubscription(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/gym-subscriptions/update`, data)
        .then((response) => {
          this.gymSubscription = response.data.data;
        })
        .catch((error) => {
          console.log('edit gym subscriptions error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async storeGymSubscription(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/gym-subscriptions/create`, data)
        .then((response) => {
          this.gymSubscription = response.data.data;
        })
        .catch((error) => {
          console.log('edit gym-subscription error ', error);
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
