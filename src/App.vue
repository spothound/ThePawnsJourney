<script setup lang="ts">
import { THEME_KEY } from 'vue-echarts'
const theme = useTheme()
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined)),
)
</script>

<template>
  <v-app class="full-size">
    <router-view />
  </v-app>
</template>

<style scoped>
.full-size {
  height: 100vh;
  overflow: hidden;
}
</style>
