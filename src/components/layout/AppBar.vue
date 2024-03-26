<script setup lang="ts">
import { useToggle, useDark } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const theme = useTheme()
const isTactil = ref(false)
const { drawer } = storeToRefs(useAppStore())
const route = useRoute()
const breadcrumbs = computed(() => {
  return route!.matched
    .slice(1)
    .filter(
      (item) =>
        item.meta && item.meta.title && !(item.meta?.breadcrumb === 'hidden'),
    )
    .map((r) => ({
      title: r.meta.title!,
      disabled:
        r.meta?.breadcrumb === 'disabled' || r.path === route.path || false,
      to: r.path,
    }))
})
const isDark = useDark({
  onChanged(dark: boolean) {
    theme.global.name.value = dark ? 'dark' : 'light'
  },
})
const toggleDark = useToggle<true, false | null>(isDark)

watchEffect(() => {
  // Verificar si el dispositivo es táctil
  isTactil.value = 'ontouchstart' in window
})
const iconSize = computed(() => {
  if (window.innerWidth < 600) {
    return 30
  } else if (window.innerWidth >= 600 && window.innerWidth < 960) {
    return 40
  } else {
    return 50
  }
})
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon v-if="isTactil" @click="drawer = !drawer" />
    <!-- <v-breadcrumbs :items="breadcrumbs"> </v-breadcrumbs> -->
    <h1
      class="flex items-center text-h6 xxxs:text-lg xxs:text-lg md:text-3xl font-weight-bold"
    >
      <v-icon :size="iconSize" icon="custom:logo-3-pj" class="me-2"></v-icon>
      The Pawn's Journey
    </h1>
    <v-spacer />
    <div class="flex flex-wrap me-3">
      <v-switch
        :model-value="isDark"
        color=""
        hide-details
        density="compact"
        inset
        false-icon="mdi-white-balance-sunny"
        true-icon="mdi-weather-night"
        style="opacity: 0.8"
        @update:model-value="toggleDark"
      ></v-switch>
      <div id="app-bar" class="ms-2">
        <!-- login icon to handle login state -->
        <v-btn
          v-if="!authStore.isLoggedIn"
          icon
          class="bg-blue-lighten-2"
          @click="$router.push('/login_google')"
        >
          <v-icon size="25" icon="mdi-login"></v-icon>
        </v-btn>
        <!-- If user is logged in and not isTactil show: Welcome, "username" and a circle with the profile photo-->
        <v-avatar
          v-if="authStore.isLoggedIn && !isTactil"
          size="40"
          class="me-2"
          @click="$router.push('/profile')"
        >
          <v-img :src="authStore.user?.photoURL" />
        </v-avatar>
        <v-btn
          v-if="authStore.isLoggedIn"
          color="red-lighten-2"
          icon
          @click="authStore.logout"
        >
          <v-icon size="30" icon="mdi-logout"></v-icon>
        </v-btn>
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped>
:deep(.v-breadcrumbs-divider) {
  opacity: 0.5;
}
#app-bar .v-btn--icon.v-btn--density-default {
  width: calc(var(--v-btn-height) + 6px);
  height: calc(var(--v-btn-height) + 6px);
}
</style>
