<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_1000_1500.json'
definePage({
  meta: {
    title: 'Training 1000-1500',
    icon: 'mdi-pencil',
    drawerIndex: 2,
  },
})
</script>

<template>
  <div class="wrapper">
    <TrainingSession :puzzle-colection="data" :level="2"/>
  </div>
</template>
