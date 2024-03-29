import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useEmployeeOrderStore = defineStore('employeeOrder', {
  state: () => ({
    employeesOrder: [],
    employeeOrder: {
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
    async fetchEmployeesOrder(params = {}) {
      this.employeesOrder = [];
      this.loading = true;
      await api
        .post('/api/employees-order/search', params)
        .then((response) => {
          this.employeesOrder = response.data.data.records;

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

    async fetchEmployeeOrder(id) {
      this.employeeOrder = null;
      this.loading = true;
      await api
        .get(`/api/employees-order/${id}`)
        .then((response) => {
          this.employeeOrder = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editEmployeeOrder(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;
      if (!data.id) {
        alert('error')
        return
      }
      await api
        .put(`/api/employees-order/update`, data)
        .then((response) => {
          this.employeeOrder = response.data.data;
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
    async deleteEmployeeOrder(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/employees-order/delete`, { params: { id: id } })
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

    async storeEmployeeOrder(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/employees-order/create`, data)
        .then((response) => {
          this.employeeOrder = response.data.data;
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
