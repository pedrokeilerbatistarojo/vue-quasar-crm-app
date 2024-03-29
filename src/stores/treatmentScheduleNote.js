import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useTreatmentScheduleNoteStore = defineStore('treatmentScheduleNote', {
  state: () => ({
    treatmentScheduleNotes: [],
    treatmentScheduleNote: null,
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
    getPostsPerAuthor: (state) => {
      return (authorId) =>
        state.products.filter((product) => product.userId === authorId);
    },
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async fetchTreatmentScheduleNotes(params = {}) {
      this.treatmentScheduleNotes = [];
      this.loading = true;
      await api
        .post('/api/treatment-schedule-notes/search', params)
        .then((response) => {
          this.treatmentScheduleNotes = response.data.data.records;

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

    async fetchTreatmentScheduleNote(id) {
      this.treatmentScheduleNote = null;
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      await api
        .get(`/api/treatment-schedule-notes/${id}`)
        .then((response) => {
          this.treatmentScheduleNote = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editTreatmentScheduleNote(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/treatment-schedule-notes/update`, data)
        .then((response) => {
          this.treatmentScheduleNote = response.data.data;
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

    async storeTreatmentScheduleNote(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/treatment-schedule-notes/create`, data)
        .then((response) => {
          this.treatmentScheduleNote = response.data.data;
        })
        .catch((error) => {
          console.log('edit category error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async deleteTreatmentScheduleNote(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      return await api
        .delete(`/api/treatment-schedule-notes/delete`, { params: { id: id } })
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
