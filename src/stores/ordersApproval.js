import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useOrderApprovalStore = defineStore('orderApproval', {
  state: () => ({
    orderApprovals: [],
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
    async fetchOrderApprovals(params = {}) {
      this.orderApprovals = [];
      this.loading = true;
      await api
        .post('/api/orders-approval/search', params)
        .then((response) => {
          this.orderApprovals = response.data.data.records;

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

    async processApproved(ids) {
      this.loading = true;
      await api
        .post('/api/orders-approval/process', { id: ids })
        .then((response) => {
          this.fetchOrderApprovals();
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async deleteOrderApprove(id) {
      this.loading = true;
      await api
        .delete('/api/orders-approval/delete', { params: { id: id } })
        .then((response) => {
          this.fetchOrderApprovals();
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
