<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_500_1000.json'
definePage({
  meta: {
    icon: 'mdi-numeric-2',
    title: 'Training 500-1000',
    drawerIndex: 1,
  },
})
</script>

<template>
  <div class="wrapper full-size">
    <TrainingSession :puzzle-colection="data" :level="1"/>
  </div>
</template>

<style scoped>
.full-size {
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
}
</style>
