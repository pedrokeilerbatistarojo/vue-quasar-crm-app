import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useClientFileStore = defineStore('clientFile', {
  state: () => ({
    clientFiles: [],
    clientFile: null,
    loading: false,
    error: null,
    validationsErrors: null,
    fileInfo: null,
  }),
  getters: {},
  actions: {
    async fetchClientFiles(params = {}) {
      params.includes = 'client,createdByUser';

      this.clientFiles = [];
      this.loading = true;
      await api
        .post('/api/client-files/search', params)
        .then((response) => {
          this.clientFiles = response.data.data.records;

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

    async fetchClientFile(id, includes = 'client,createdByUser') {
      this.clientFile = {};
      this.loading = true;
      await api
        .get(`/api/client-file/${id}`, {
          params: { includes: includes },
        })
        .then((response) => {
          this.clientFile = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async createClientFile(data) {
      this.clientFile = null;
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .post(`/api/client-file/create`, data)
        .then((response) => {
          this.clientFile = response.data.data;
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

    async storeClientFile(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      let formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }

      await api
        .post(`/api/client-files/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          this.client = response.data.data;
        })
        .catch((error) => {
          console.log('edit client error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async getDocument(id) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      this.clientFile = null;

      await api
        .get(`/api/client-files/${id}/file`)
        .then((response) => {
          this.fileInfo = response.data;
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

    async deleteClientFile(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/client-file/delete`, { params: { id: id } })
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
