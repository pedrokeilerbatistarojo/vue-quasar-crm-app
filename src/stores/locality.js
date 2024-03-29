import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useLocalityStore = defineStore('locality', {
  state: () => ({
    localities: [],
    provinces: [],
    locality: null,
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
    async fetchLocalities(params) {
      this.localities = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/localities/search', params)
        .then((response) => {
          this.localities = response.data.data.records;

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

    async fetchProvinces(params) {
      this.provinces = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/localities/provinces', params)
        .then((response) => {
          this.provinces = response.data.data.records;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async fetchLocality(id) {
      this.locality = null;
      this.loading = true;
      await api
        .get(`/api/localities/${id}`)
        .then((response) => {
          this.locality = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchLocalityToForm(id) {
      this.loading = true;
      this.localityToForm = null;
      await api
        .get(`/api/localities/${id}`)
        .then((response) => {
          this.localityToForm = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editLocality(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/localities/update`, data)
        .then((response) => {
          this.locality = response.data.data;
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

    async storeLocality(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/localities/create`, data)
        .then((response) => {
          this.locality = response.data.data;
        })
        .catch((error) => {
          console.log('edit locality error ', error);
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
