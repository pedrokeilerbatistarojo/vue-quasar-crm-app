import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import FormatService from 'src/services/FormatService';
import PaginationService from './../services/PaginationService.js';

export const useOrderStore = defineStore('orderDetail', {
  state: () => ({
    orderDetails: [],
    orderDetail: {},
    newOrder: {
      client_id: null,
      source: null,
      total_price: 0,
      details: [],
      payments: [],
      current_row_editing: null,
      auto_increment: 0,
    },
    loading: false,
    error: null,
    validationsErrors: null,
    pdfTicket: null,
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
    getCreatedAt: (state) =>
      state.orderDetail
        ? FormatService.setFullDateFormat(state.orderDetail.created_at)
        : null,
    getTotalAmount: (state) =>
      FormatService.setCurrencyFormat(state.orderDetail.price * state.orderDetail.quantity) + '€',
  },
  actions: {
    async fetchOrderDetails(params = {}) {
      params.includes = 'client,orderDetails.product.productType,createdByUser';

      this.orderDetails = [];
      this.loading = true;
      await api
        .post('/api/orderDetails/search', params)
        .then((response) => {
          this.orderDetails = response.data.data.records;

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

    async fetchOrder(
      id,
      includes = 'client,orderDetails.product.productType,orderDetails.circuitReservations,orderDetails.treatmentReservations'
    ) {
      this.orderDetail = {};
      this.loading = true;
      await api
        .get(`/api/orderDetails/${id}`, {
          params: { includes: includes },
        })
        .then((response) => {
          this.orderDetail = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async deleteOrder(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/order-details/delete`, { params: { id: id } })
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
