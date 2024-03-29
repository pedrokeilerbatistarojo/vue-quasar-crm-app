import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
    productDiscounts: [],
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
        state.products.filter((product) => product.userId === authorId);
    },
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async fetchProducts(params = {}) {
      params.includes = 'productType';
      this.products = [];
      this.loading = true;
      await api
        .post('/api/products/search', params)
        .then((response) => {
          this.products = response.data.data.records;

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

    async fetchProduct(id, includes = 'productDiscounts.discount') {
      this.product = null;
      this.loading = true;
      await api
        .get(`/api/products/${id}`, {
          params: { includes: includes },
        })
        .then((response) => {
          this.product = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editProduct(data, includes = 'productDiscounts.discount') {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;
      data.includes = includes;

      await api
        .put(`/api/products/update`, data)
        .then((response) => {
          console.log(response.data.data);
          this.product = response.data.data;
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

    async storeProduct(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/products/create`, data)
        .then((response) => {
          this.product = response.data.data;
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
    async addProductDiscount(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/product-discounts/create`, data)
        .then((response) => {})
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
    async fetchProductDiscounts(discountId) {
      const params = {
        paginate_size: 1000000,
        discount_id: discountId,
      };

      this.productTypes = [];
      this.loading = true;
      await api
        .post('/api/product-discounts/search', params)
        .then((response) => {
          this.productDiscounts = response.data.data.records;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },
    async deleteProductDiscount(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/product-discounts/delete`, { params: { id: id } })
        .then((response) => {
          // this.product = response.data.data;
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
    async deleteProduct(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/products/delete`, { params: { id: id } })
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
