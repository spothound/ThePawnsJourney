<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_3000_3500.json'
definePage({
  meta: {
    title: 'Training 3000-3500',
    icon: 'mdi-numeric-7',
    drawerIndex: 6,
  },
})
</script>

<template>
  <div class="wrapper full-size">
    <TrainingSession :puzzle-colection="data" :level="6"/>
  </div>
</template>

<style scoped>
.full-size {
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
}
</style>
