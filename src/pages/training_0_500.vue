<script setup lang="ts">
import data from '../puzzles/puzzles_200.json'
import type { Puzzle } from '@/types'

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
    <TrainingSession :puzzle-colection="data as Puzzle[]" :level="200" />
  </div>
</template>
