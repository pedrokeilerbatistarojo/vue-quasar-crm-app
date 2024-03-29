import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    excelList: null,
    duplicateList: [],
    client: null,
    clientToForm: null,
    templatePdf: null,
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
    async fetchClients(params) {
      this.clients = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/clients/search', params)
        .then((response) => {
          this.clients = response.data.data.records;

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

    async fetchClient(id) {
      this.client = null;
      this.loading = true;
      await api
        .get(`/api/clients/${id}`, {
          params: {
            includes:
              'locality.province,clientFiles.createdByUser,clientNotes.createdByUser',
          },
        })
        .then((response) => {
          this.client = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchClientToForm(id) {
      this.loading = true;
      this.clientToForm = null;
      await api
        .get(`/api/clients/${id}`, {
          params: { includes: 'locality.province,clientNotes.createdByUser' },
        })
        .then((response) => {
          this.clientToForm = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editClient(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/clients/update`, data)
        .then((response) => {
          this.client = response.data.data;
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

    async storeClient(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/clients/create`, data)
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

    async getExcelList(params = {}) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      this.excelList = null;

      await api
        .post(`/api/clients/export-excel`, params)
        .then((response) => {
          this.excelList = response.data.data;
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

    async getDuplicateList(params = {}) {
      this.duplicateList = [];
      this.error = null;
      this.loading = true;

      await api
        .post(`/api/clients/duplicates`, params)
        .then((response) => {
          this.duplicateList = response.data.data.records;

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
    async fetchDownloadTemplate(id) {
      this.templatePdf = null;
      this.loading = true;
      await api
        .get(`/api/clients/download-template/${id}`)
        .then((response) => {
          this.templatePdf = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async sendConsentMail(params) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .post(`/api/clients/send-consent-email`, params)
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
