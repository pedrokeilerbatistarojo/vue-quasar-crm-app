import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useEmployeeTimeOffStore = defineStore('employeeTimeOff', {
  state: () => ({
    employeesTimeOff: [],
    employeeTimeOff: {
      name: null,
    },
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
  actions: {
    async fetchEmployeesTimeOff(params = {}) {
      params.include = 'employee'
      this.employeesTimeOff = [];
      this.loading = true;
      await api
        .post('/api/employee-time-off/search', params)
        .then((response) => {
          this.employeesTimeOff = response.data.data.records;

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

    async fetchEmployeeTimeOff(id) {
      this.employeeTimeOff = null;
      this.loading = true;
      await api
        .get(`/api/employee-time-off/${id}`)
        .then((response) => {
          this.employeeTimeOff = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editEmployeeTimeOff(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;
      await api
        .put(`/api/employee-time-off/update`, data)
        .then((response) => {
          this.employeeTimeOff = response.data.data;
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
    async deleteEmployeeTimeOff(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/employee-time-off/delete`, { params: { id: id } })
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

    async storeEmployeeTimeOff(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/employee-time-off/create`, data)
        .then((response) => {
          this.employeeTimeOff = response.data.data;
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
