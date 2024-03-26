import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:meta-layouts'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: (routes) => setupLayouts(routes),
})

router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from)

  const authStore = useAuthStore()

  // Check if the route requires the user to be logged in
  if (to.name === '/puzzles_for_stockfish' && !authStore.loggedIn) {
    // If the user is not logged in, redirect to the login page
    next({ name: 'Homepage' })
  } else {
    // Otherwise, proceed as normal
    next()
  }
})

export default router
