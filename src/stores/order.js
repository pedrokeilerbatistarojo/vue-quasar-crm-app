import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import FormatService from 'src/services/FormatService';
import PaginationService from './../services/PaginationService.js';
import { reactive } from 'vue';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    order: null,
    newOrder: {
      client_id: null,
      source: null,
      type: null,
      company_id: null,
      total_price: 0,
      details: [],
      payments: [],
      current_row_editing: null,
      auto_increment: 0,
      payment_increment: 0,
      discount_id: null,
      discount_name: null,
      counter_sale_seq: null,
      used_purchase: false,
      note: null,
    },
    loading: false,
    error: null,
    validationsErrors: null,
    pdfTicket: null,
    productionReport: null,
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
      state.order ? FormatService.setFullDateFormat(state.order.created_at) : null,
    getTotalAmount: (state) =>
      state.order ? FormatService.setCurrencyFormat(state.order.total_price) + '€' : null,
    getStatus: (state) => {
      if (state.order?.payments) {
        return state.order.payments.every(
          (payment) => payment.paid_date !== null
        ) ? 'Pagado' : 'Pendiente';
      }

      return 'Sin pagos';
    },
  },
  actions: {
    async fetchOrders(params = {}) {
      params.includes = 'client,orderDetails.product.productType,createdByUser';

      this.orders = [];
      this.loading = true;
      await api
        .post('/api/orders/search', params)
        .then((response) => {
          this.orders = response.data.data.records;

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
      this.order = {};
      this.loading = true;
      await api
        .get(`/api/orders/${id}`, {
          params: { includes: includes },
        })
        .then((response) => {
          this.order = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchOrdersByClient(clientId) {
      this.orders = [];
      this.loading = true;
      await api
        .post('/api/orders/search', {
          includes:
            'orderDetails.product.productType,orderDetails.circuitReservations,orderDetails.treatmentReservations',
          client_id: clientId,
        })
        .then((response) => {
          this.orders = response.data.data.records;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async createOrder(data) {
      this.order = null;
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

        await api
        .post(`/api/orders/create`, data)
        .then((response) => {
          this.order = response.data.data;
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
    async getPdfTicket(id) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      this.pdfTicket = null;

      await api
        .post(`/api/orders/ticket`, { id: id })
        .then((response) => {
          this.pdfTicket = response.data.data;
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

    async deleteOrder(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/orders/delete`, { params: { id: id } })
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
    async prepareNewOrder(clientId, orderTotalAmount, companyId) {
      this.newOrder = {
        client_id: clientId ? clientId : null,
        source: 'CRM',
        type: null,
        total_price: orderTotalAmount,
        company_id: companyId,
        details: reactive([]),
        payments: reactive([
          {
            index: 0,
            type: 'Efectivo',
            amount: null,
            paid_amount: null,
            returned_amount: null,
          },
        ]),
        current_row_editing: null,
        auto_increment: 0,
        payment_increment: 0,
        discount_id: null,
        discount_name: null,
        counter_sale_seq: null,
        used_purchase: false,
        note: null,
      };
    },
    async fetchProductionReport(params) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      this.productionReport = null;

      await api
        .post(`/api/orders/production-report`, params)
        .then((response) => {
          this.productionReport = response.data.data;
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
    async sendTicketMail(params) {
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;

      await api
        .post(`/api/orders/send-ticket-email`, params)
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
    async markUsedPurchaseOrder(id, usedPurchaseValue) {
      this.error = null;
      this.validationsErrors = null;

      await api
        .patch(`/api/orders/mark-used-purchase`, {
          id: id,
          used_purchase: usedPurchaseValue,
        })
        .then(() => { })
        .catch((error) => {
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => { });
    },
    async editNoteOrder(id, note) {
      this.error = null;
      this.validationsErrors = null;

      await api
        .patch(`/api/orders/edit-note`, {
          id: id,
          note: note,
        })
        .then(() => { })
        .catch((error) => {
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => { });
    },
  },
});
