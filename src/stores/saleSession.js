import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import ClientService from 'src/services/ClientService';
import PaginationService from './../services/PaginationService.js';
import FormatService from 'src/services/FormatService.js';

export const useSaleSessionStore = defineStore('saleSession', {
  state: () => ({
    saleSessions: [],
    saleSession: {},
    currentSaleSession: {},
    payments: [],
    loading: false,
    currentSaleSessionLoading: false,
    error: null,
    validationsErrors: null,
    pdfInfo: null,
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
    cash: (state) =>
      FormatService.setCurrencyFormat(
        state.payments
          .filter((payment) => payment.type === 'Efectivo')
          .reduce(function (sum, current) {
            return sum + current.amount;
          }, 0)
      ) + ' €',
    creditCard: (state) =>
      FormatService.setCurrencyFormat(
        state.payments
          .filter((payment) => payment.type === 'Tarjeta de Crédito')
          .reduce(function (sum, current) {
            return sum + current.amount;
          }, 0)
      ) + ' €',
    transfer: (state) =>
      FormatService.setCurrencyFormat(
        state.payments
          .filter((payment) => payment.type === 'Transferencia')
          .reduce(function (sum, current) {
            return sum + current.amount;
          }, 0)
      ) + ' €',
    totalSale: (state) =>
      FormatService.setCurrencyFormat(
        state.payments.reduce(function (sum, current) {
          return sum + current.amount;
        }, 0)
      ) + ' €',
    totalAmount: (state) =>
      state.payments.reduce(function (sum, current) {
        return sum + current.amount;
      }, 0).toFixed(2),
  },
  actions: {
    async fetchCurrentSaleSession() {
      this.loading = true;
      this.currentSaleSession = {};
      this.currentSaleSessionLoading = true;
      this.payments = [];
      await api
        .post(`/api/sale-sessions/active`, {
          includes: 'orders.payments,createdByUser,orders.client',
        })
        .then((response) => {
          this.currentSaleSession = response.data.data;

          if (this.currentSaleSession.orders) {
            for (const order of this.currentSaleSession.orders) {
              if (order.payments) {
                for (const payment of order.payments) {
                  payment.order_locator = order.locator;
                  payment.client = ClientService.getFullName(order.client);
                  payment.client_id = order.client_id;
                  this.payments.push(payment);
                }
              }
            }
          }
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
          this.currentSaleSessionLoading = false;
        });
    },

    async fetchSaleSessions(params = {}) {
      params.includes = 'createdByUser,closedByUser';

      this.saleSessions = [];
      this.loading = true;
      this.payments = [];
      await api
        .post('/api/sale-sessions/search', params)
        .then((response) => {
          this.saleSessions = response.data.data.records;
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

    async fetchSaleSession(id) {
      this.saleSession = null;
      this.loading = true;
      this.payments = [];
      await api
        .get(`/api/sale-sessions/${id}`, {
          params: { includes: 'orders.payments,createdByUser' },
        })
        .then((response) => {
          this.saleSession = response.data.data;
          for (const order of this.saleSession.orders) {
            if (order.payments) {
              for (const payment of order.payments) {
                payment.order_locator = order.locator;
                this.payments.push(payment);
              }
            }
          }
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async createSaleSession(data) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .post(`/api/sale-sessions/create`, data)
        .then((response) => {
          this.currentSaleSession = response.data.data;
        })
        .catch((error) => {
          console.log(error);
          this.error = error;
          if (error.response.status === 422) {
            console.log(error);
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async closeSaleSession(data) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .patch(`/api/sale-sessions/close`, data)
        .then((response) => {
          this.currentSaleSession = null;
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
    async reopenSaleSession() {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .post(`/api/sale-sessions/reopen`)
        .then((response) => {
          this.currentSaleSession = response.data.data;
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
    async getPdfInfo(id) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      this.pdfTicket = null;

      await api
        .post(`/api/sale-sessions/orders-pdf`, { id: id })
        .then((response) => {
          this.pdfInfo = response.data.data;
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
    async getPdfPayments(id) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      this.pdfTicket = null;

      await api
        .post(`/api/sale-sessions/payments-pdf`, { id: id })
        .then((response) => {
          this.pdfInfo = response.data.data;
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
