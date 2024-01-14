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

const lastPuzzle = JSON.parse(localStorage.getItem(`lastPuzzle_${props.level}`) || '0')
const puzzleRankings = JSON.parse(localStorage.getItem(`puzzleRankings_${props.level}`) || '[]')
const currentPuzzle = ref(lastPuzzle)
const solved = ref(false)
const requiredTime = ref(0)

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
  if(puzzleRankings.length < currentPuzzle.value + 1) {
    puzzleRankings.push(calculateRank(timeElapsed, moves, failures))
  }
  else {
    puzzleRankings[currentPuzzle.value] = calculateRank(timeElapsed, moves, failures)
  }
  localStorage.setItem(`puzzleRankings_${props.level}`, JSON.stringify(puzzleRankings))
}

function nextPuzzle () {
  solved.value = false
  currentPuzzle.value++
  localStorage.setItem(`lastPuzzle_${props.level}`, JSON.stringify(currentPuzzle.value))
}
</script>

<template>
  <v-container class="full-size center-text">
    <v-row justify="center">
      <v-col cols="12">
        <ChessPuzzle @solved="puzzleSolved" :key="puzzleColection[currentPuzzle].PuzzleId" :puzzle-data="puzzleColection[currentPuzzle]" />
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
