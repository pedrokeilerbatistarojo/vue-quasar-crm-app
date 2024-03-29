import { defineStore } from 'pinia'
import { useClientStore } from './client'

export const useEventStore = defineStore('event', {
    state: () => ({
      events: []
    }),
    getters: {
      getPostComments: (state) => {
        const clientStore = useClientStore()
        return state.events.filter((event) => event.clientId === clientStore.client.id)
      }
    },
    actions: {
      async getEvents() {
        this.events = await api('https://jsonplaceholder.typicode.com/comments')
        .then((response) => response.json())
      }
    }
  })