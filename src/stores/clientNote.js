import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useClientNoteStore = defineStore('clientNote', {
  state: () => ({
    clientNote: null,
    clientNotes: null,
    loading: false,
    error: null,
    validationsErrors: null,
  }),
  actions: {
    async fetchClientNotes(params) {
      params.pagination_size = 1000000;
      params.includes = 'createdByUser';
      this.clientNotes = [];
      this.error = null;
      this.loading = true;
      await api
        .post('/api/client-notes/search', params)
        .then((response) => {
          this.clientNotes = response.data.data.records;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async editClientNote(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/client-notes/update`, data)
        .then((response) => {
          this.clientNote = response.data.data;
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

    async storeClientNote(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/client-notes/create`, data)
        .then((response) => {
          this.clientNote = response.data.data;
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
  },
});
