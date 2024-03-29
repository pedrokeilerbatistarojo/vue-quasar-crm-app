import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [],
    employee: {
      name: null,
    },
    schedulePdf: null,
    loading: false,
    error: null,
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
        state.employees.filter((employee) => employee.userId === authorId);
    },
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async fetchEmployees(params = {}) {
      this.employees = [];
      this.loading = true;
      await api
        .post('/api/employees/search', params)
        .then((response) => {
          this.employees = response.data.data.records;

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

    async fetchEmployee(id) {
      this.employee = null;
      this.loading = true;
      await api
        .get(`/api/employees/${id}`)
        .then((response) => {
          this.employee = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editEmployee(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/employees/update`, data)
        .then((response) => {
          this.employee = response.data.data;
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

    async storeEmployee(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/employees/create`, data)
        .then((response) => {
          this.employee = response.data.data;
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
    async fetchEmployeeSchedulePdf(employeeId, date) {
      this.schedulePdf = null;
      this.loading = true;
      await api
        .get(`/api/treatment-reservations/schedules-pdf/${date}/${employeeId}`)
        .then((response) => {
          this.schedulePdf = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
