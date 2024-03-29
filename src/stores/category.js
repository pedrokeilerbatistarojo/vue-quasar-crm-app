import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import PaginationService from './../services/PaginationService.js';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    category: null,
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
    async fetchCategories(params = {}) {
      this.categories = [];
      this.loading = true;
      await api
        .post('/api/categories/search', params)
        .then((response) => {
          this.categories = response.data.data.records;

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

    async fetchCategory(id) {
      this.category = null;
      this.loading = true;
      this.validationsErrors = null;
      this.error = null;
      await api
        .get(`/api/categories/${id}`)
        .then((response) => {
          this.category = response.data.data;
        })
        .catch((error) => (this.error = error))
        .finally(() => {
          this.loading = false;
        });
    },

    async editCategory(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .put(`/api/categories/update`, data)
        .then((response) => {
          this.category = response.data.data;
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

    async storeCategory(data) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      await api
        .post(`/api/categories/create`, data)
        .then((response) => {
          this.category = response.data.data;
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

    async deleteCategory(id) {
      this.loading = true;
      this.error = null;
      this.validationsErrors = null;

      return await api
        .delete(`/api/categories/delete`, { params: { id: id } })
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
