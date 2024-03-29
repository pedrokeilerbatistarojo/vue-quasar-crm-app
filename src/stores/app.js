import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: false,
  }),
  actions: {
    async toggleLeftDrawer() {
      this.drawer = !this.drawer;
    },
    async hideMenu() {
      this.drawer = false;
    },
  },
});
