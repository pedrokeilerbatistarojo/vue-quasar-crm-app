import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useGymFeeTypeStore = defineStore('gymFeeType', {
  state: () => ({
    gymFeeTypes: [],
    gymFeeType: null,
    clientToForm: null,
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
    prices: (state) => {
      const prices = state.gymFeeTypes.map(({ price }) => price);
      return [...new Set(prices)];
    },
    period_type: (state) => {
      const period_type = state.gymFeeTypes.map(({ period_type }) => period_type);
      return [...new Set(period_type)];
    },
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async fetchGymFeeTypes(params = {}) {
      this.gymFeeTypes = [];
      this.loading = true;
      await api
        .post('/api/gym-fee-types/search', params)
        .then((response) => {
          this.gymFeeTypes = response.data.data.records;

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

    async fetchGymFeeType(id) {
      this.gymFeeType = null;
      this.loading = true;
      await api
        .get(`/api/gym-fee-types/${id}`)
        .then((response) => {
          this.gymFeeType = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editGymFeeType(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/gym-fee-types/update`, data)
        .then((response) => {
          this.gymFeeType = response.data.data;
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

    async storeGymFeeType(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/gym-fee-types/create`, data)
        .then((response) => {
          this.gymFeeType = response.data.data;
        })
        .catch((error) => {
          console.log('edit gym fee type error ', error);
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
