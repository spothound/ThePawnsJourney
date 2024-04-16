<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const puzzleId = ref((route.params as any).id)

const puzzleColection = [
  {
    "PuzzleId": puzzleId
  }
]

</script>

<template>
  <div class="wrapper full-size">
    <Suspense>
    <template #default>
      <LichessPuzzle :puzzle-id="puzzleId" />
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
