<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_1500_2000.json'
definePage({
  meta: {
    title: 'Training 1500-2000',
    icon: 'mdi-pencil',
    drawerIndex: 3,
  },
})
</script>

<template>
  <div class="wrapper full-size">
    <TrainingSession :puzzle-colection="data" :level="0"/>
  </div>
</template>

<style scoped>
.full-size {
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
}
</style>
