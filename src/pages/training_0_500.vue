<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_0_500.json'
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
    <TrainingSession :puzzle-colection="data" :level="0" />
  </div>
</template>