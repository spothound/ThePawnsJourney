<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const puzzleId = ref((route.params as any).id)
</script>

<template>
  <div class="wrapper full-size">
    <Suspense>
    <template #default>
      <Puzzle :puzzleId="puzzleId" />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
    </Suspense>
  </div>
</template>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
