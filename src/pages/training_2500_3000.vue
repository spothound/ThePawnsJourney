<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_2500_3000.json'
definePage({
  meta: {
    title: 'Training 2500-3000',
    icon: 'mdi-numeric-6',
    drawerIndex: 5,
  },
})
</script>

<template>
  <div class="wrapper full-size">
    <TrainingSession :puzzle-colection="data" :level="5"/>
  </div>
</template>

<style scoped>
.full-size {
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
}
</style>
