<script setup lang="ts">
import PuzzlesForStockfish from '@/components/PuzzlesForStockfish.vue';
import data from '../puzzles/puzzles_200.json'
definePage({
  meta: {
    icon: 'mdi-fish',
    title: 'Stockfish Puzzles',
    drawerIndex: 0,
  },
})
</script>

<template>
  <div class="wrapper w-full">
    <PuzzlesForStockfish :puzzle-colection="data" :chunk="200" />
  </div>
</template>