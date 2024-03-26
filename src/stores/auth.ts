import { defineStore } from 'pinia'
import type { User, AccessToken } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: true,
    user: null as User | null,
    accessToken: null as AccessToken | null,
  }),

  actions: {
    login(username: string, email: string, token: string) {
      // Lógica para iniciar sesión y actualizar el estado
      this.loggedIn = true
      ;(this.user = { username, email } as User),
        (this.accessToken = token as AccessToken)
    },

    logout() {
      // Lógica para cerrar sesión y limpiar el estado
      this.loggedIn = false
      this.user = null
      this.accessToken = null
    },
  },
})
