import { defineStore } from 'pinia'
import type { User, AccessToken } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false,
    user: null as User | null,
    accessToken: null as AccessToken | null,
  }),

  actions: {
    login(username: string, email: string, photoURL: string, token: string) {
      // Lógica para iniciar sesión y actualizar el estado
      this.loggedIn = true
      ;(this.user = { username, email, photoURL } as User),
        (this.accessToken = token as AccessToken)
    },

    logout() {
      // Lógica para cerrar sesión y limpiar el estado
      this.loggedIn = false
      this.user = null
      this.accessToken = null
    },
  },
  getters: {
    // Getter para obtener el estado de inicio de sesión
    isLoggedIn(): boolean {
      return this.loggedIn
    },
    // Getter para obtener el token de acceso
    getAccessToken(): AccessToken | null {
      return this.accessToken
    },
  },
})
