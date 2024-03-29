import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useProductTypeStore = defineStore('productType', {
  state: () => ({
    productTypes: [],
    productType: null,
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
    categories: (state) => {
      const categories = state.productTypes.map(({ category }) => category);
      return [...new Set(categories)];
    },
    getPostsPerAuthor: (state) => {
      return (authorId) =>
        state.products.filter((product) => product.userId === authorId);
    },
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async fetchProductTypes(params = {}) {
      params.includes = 'category';
      this.productTypes = [];
      this.loading = true;
      await api
        .post('/api/product-types/search', params)
        .then((response) => {
          this.productTypes = response.data.data.records;

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

    async fetchProductType(id) {
      this.productType = null;
      this.loading = true;
      await api
        .get(`/api/product-types/${id}`)
        .then((response) => {
          this.productType = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editProductType(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/product-types/update`, data)
        .then((response) => {
          this.productType = response.data.data;
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

    async storeProductType(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/product-types/create`, data)
        .then((response) => {
          this.productType = response.data.data;
        })
        .catch((error) => {
          console.log('edit productType error ', error);
          this.error = error;
          if (error.response.status === 422) {
            this.validationsErrors = error.response.data.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async deleteProductType(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .delete(`/api/product-types/delete`, {params:{id}})
        .then((response) => {
          this.productType = response.data.data;
        })
        .catch((error) => {
          console.log('delete productType error ', error);
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
