<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/puzzles_200.json'
definePage({
  meta: {
    icon: 'mdi-numeric-1',
    title: 'Training 0-500',
    drawerIndex: 0,
  },
})
</script>

<template>
  <div class="wrapper w-full">
    <TrainingSession :puzzle-colection="data" :level="200" />
  </div>
</template>