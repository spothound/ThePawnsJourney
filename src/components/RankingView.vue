<script setup lang="ts">
const puzzleRankings = JSON.parse(localStorage.getItem('puzzleRankings') || '[]')
const lastPuzzle = JSON.parse(localStorage.getItem('lastPuzzle') || '0')
const currentPuzzle = ref(lastPuzzle)
</script>


<template>
  <v-row class="rankings" justify="center">
  <div
    v-for="(rank, index) in puzzleRankings"
    :key="index"
    :class="['rank-square', rank !== undefined ? `rank-${rank}` : 'default', index === currentPuzzle ? 'current-rank' : '']"
  ></div>
  </v-row>
</template>

<style scoped>

.center-text {
  text-align: center;
}
.rankings {
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}

.rank-square {
  width: 3vh;
  height: 3vh;
  margin: 2px;
  border-radius: 6px;
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5); /* White glow */
  border: 1px solid #ddd; /* Light gray border */
}

.current-rank {
  border: 3px solid #ffffff;
}

.rank-square.default {
  background: linear-gradient(to right, #b2b2b2, #a39d9d);
}

.rank-square.rank-0 {
  background: linear-gradient(to right, #c20404, #ef3c3c);
}

.rank-square.rank-1 {
  background: linear-gradient(to right, #ff8000, #f58e26);
}

.rank-square.rank-2 {
  background: linear-gradient(to right, #eeff00, #eaea17);
}

.rank-square.rank-3 {
  background: linear-gradient(to right, #3b9f01, #3cbf10);
}

.rank-square.rank-4 {
  background: linear-gradient(to right, #0def7e, #06b469);
}

.rank-square.rank-5 {
  background: linear-gradient(to right, #0091f9, #217dda);
}
</style>
