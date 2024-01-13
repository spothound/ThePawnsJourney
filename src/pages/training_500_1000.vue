<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_500_1000.json'
definePage({
  meta: {
    icon: 'mdi-pencil',
    title: 'Training 500-1000',
    drawerIndex: 1,
  },
})
</script>

<template>
  <div class="wrapper">
    <TrainingSession :puzzle-colection="data" :level="1"/>
  </div>
</template>
