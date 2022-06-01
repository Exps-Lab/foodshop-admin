import { defineStore } from 'pinia'

export const testStore = defineStore('test', {
  state: () => ({
    counter: 123,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    resetCount() {
      this.counter = 0
    },
    addCount () {
      this.counter += 1
    }
  },
})