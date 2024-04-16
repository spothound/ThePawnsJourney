<script setup lang="ts">
import { THEME_KEY } from 'vue-echarts'
const theme = useTheme()
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined)),
)
</script>

<template>
  <v-app class="h-full overflow-hidden">
    <router-view />
  </v-app>
</template>

