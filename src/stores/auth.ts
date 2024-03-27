import { defineStore } from 'pinia'
import { eraseCookies } from '@/helper'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false,
    user: null as User | null,
  }),

  actions: {
    login(data: User) {
      // Logic for logging in and updating the state
      this.loggedIn = true
      this.user = data
    },

    logout() {
      // Logic for logging out and clearing the state
      this.loggedIn = false
      this.user = null
      // Clear cookies
      eraseCookies()
    },
  },
  getters: {
    // Getter to get the login state
    isLoggedIn(): boolean {
      return this.loggedIn
    },
  },
})
