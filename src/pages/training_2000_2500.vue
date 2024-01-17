<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_2000_2500.json'
definePage({
  meta: {
    title: 'Training 2000-2500',
    icon: 'mdi-numeric-5',
    drawerIndex: 4,
  },
})
</script>

<template>
  <div class="wrapper full-size">
    <TrainingSession :puzzle-colection="data" :level="4"/>
  </div>
</template>

<style scoped>
.full-size {
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
}
</style>
