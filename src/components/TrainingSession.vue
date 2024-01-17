<script setup lang="ts">

import ChessPuzzle from './ChessPuzzle.vue'
import { defineProps, ref } from 'vue'

const props = defineProps({
  level: {
    type: Number,
    required: true
  },
  puzzleColection: {
    type: Array,
    required: true
  }
})

const maxIndex = props.puzzleColection.length - 1
const puzzleRankings = new Array(maxIndex).fill(-1);
const solved = ref(false)
const requiredTime = ref(0)
const currentPuzzle = ref()

function nextPuzzle () {
  solved.value = false
  // get an array of indices where puzzleRankings equals -1
  const unplayedPuzzles = puzzleRankings
    .map((ranking, index) => ranking === -1 ? index : -1)
    .filter(index => index !== -1);
  // if there are no unplayed puzzles, do nothing
  if (unplayedPuzzles.length === 0)  Math.floor(Math.random() * puzzleRankings.length);
  // get a random index from unplayedPuzzles
  const randomIndex = Math.floor(Math.random() * unplayedPuzzles.length);
  currentPuzzle.value = unplayedPuzzles[randomIndex];
}

nextPuzzle()

function calculateRank(timeElapsed: number, moves: number, failures: number)
{
  let rank = 0
  const averageTime = timeElapsed / moves
  if (failures > 1)
    rank = 0
  else if (failures == 1)
    rank = 1
  else if (averageTime < 3500)
      rank = 5
  else if (averageTime < 7000)
      rank = 4
  else if (averageTime < 10000)
      rank = 3
  else
      rank = 2
  return rank
}

function puzzleSolved (timeElapsed: number, moves: number, failures: number) {
  solved.value = true
  requiredTime.value = timeElapsed
  puzzleRankings[currentPuzzle.value] = calculateRank(timeElapsed, moves, failures)
  localStorage.setItem(`puzzleRankings_${props.level}`, JSON.stringify(puzzleRankings))
}
</script>

<template>
  <v-container class="full-size center-text">
    <v-row justify="center">
      <v-col cols="12">
        <ChessPuzzle @solved="puzzleSolved" :key="(puzzleColection[currentPuzzle] as any).PuzzleId" :puzzle-data="(puzzleColection[currentPuzzle] as any)"/>
      </v-col>
    </v-row>
    <v-row v-show="solved" justify="center">
      <v-col cols="12" class="text-center">
        <v-btn variant="outlined" class="mx-auto" @click="nextPuzzle()">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.full-size {
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
}
.center-text {
  text-align: center;
}
</style>
