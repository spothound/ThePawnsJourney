<script setup lang="ts">
import { useToggle, useDark } from '@vueuse/core'
const theme = useTheme()
const showNavIcon = ref(false)
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
  showNavIcon.value = 'ontouchstart' in window
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
    <v-app-bar-nav-icon v-if="showNavIcon" @click="drawer = !drawer" />
    <!-- <v-breadcrumbs :items="breadcrumbs"> </v-breadcrumbs> -->
    <h1
      class="flex items-center text-h6 xxxs:text-lg xxs:text-lg md:text-3xl font-weight-bold"
    >
      <v-icon :size="iconSize" icon="custom:logo-3-pj" class="me-2"></v-icon>
      The Pawn's Journey
    </h1>
    <v-spacer />
    <!-- Add an h1 element with logo an title -->
    <div id="app-bar"></div>
    <div class="me-5">
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
    </div>
    <!-- <v-btn
      icon
      href="https://github.com/spothound/ThePawnsJourney"
      size="small"
      class="ml-2"
      target="_blank"
    >
      <v-icon size="30" icon="mdi-github"></v-icon>
    </v-btn> -->
  </v-app-bar>
</template>

<style scoped>
:deep(.v-breadcrumbs-divider) {
  opacity: 0.5;
}
</style>
