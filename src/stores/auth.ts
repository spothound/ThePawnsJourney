import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false,
    user: null as User | null,
  }),

  actions: {
    login(given_name: string, email: string, picture: string) {
      // Logic for logging in and updating the state
      this.loggedIn = true
      this.user = { given_name, email, picture } as User
    },

    logout() {
      // Logic for logging out and clearing the state
      this.loggedIn = false
      this.user = null
    },
  },
  getters: {
    // Getter to get the login state
    isLoggedIn(): boolean {
      return this.loggedIn
    },
  },
})
