<script setup lang="ts">
import type { Puzzle } from '@/types'

const puzzleColection = JSON.parse(localStorage.getItem('puzzleColection') as string);

if (!puzzleColection) {
  window.location.href = '/Setup';
}

definePage({
  meta: {
    icon: 'mdi-puzzle-star',
    title: 'Training by rating',
    drawerIndex: 0,
  },
})
</script>

<template>
  <div class="wrapper w-full">
    <TrainingSession :puzzle-colection="puzzleColection as Puzzle[]" />
  </div>
</template>
