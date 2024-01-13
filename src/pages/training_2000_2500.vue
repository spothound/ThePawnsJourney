<script setup lang="ts">
import router from '@/plugins/router';
import data from '../puzzles/ratings_2000_2500.json'
definePage({
  meta: {
    title: 'Training 2000-2500',
    icon: 'mdi-pencil',
    drawerIndex: 4,
  },
})
</script>

<template>
  <div class="wrapper">
    <TrainingSession :puzzle-colection="data" :level="4"/>
  </div>
</template>
