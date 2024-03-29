import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useGymSubscriptionMemberStore = defineStore('gymSubscriptionMember', {
  state: () => ({
    gymSubscriptionMembers: [],
    gymSubscriptionMember: null,
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
    async fetchGymSubscriptionMembers(params) {
      params.includes = 'createdByUser,client,gymSubscription';
      this.gymSubscriptionMembers = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/gym-subscription-members/search', params)
        .then((response) => {
          this.gymSubscriptionMembers = response.data.data.records;
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

    async fetchGymSubscriptionMember(id) {
      this.gymSubscriptionMember = null;
      this.loading = true;
      await api
        .get(`/api/gym-subscription-members/${id}`)
        .then((response) => {
          this.gymSubscriptionMember = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editGymSubscriptionMember(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/gym-subscription-members/update`, data)
        .then((response) => {
          this.gymSubscriptionMember = response.data.data;
        })
        .catch((error) => {
          console.log('edit gym subscription members error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async storeGymSubscriptionMember(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/gym-subscription-members/create`, data)
        .then((response) => {
          this.gymSubscriptionMember = response.data.data;
        })
        .catch((error) => {
          console.log('edit gym subscription members error ', error);
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
