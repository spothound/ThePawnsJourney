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
    <ChessPuzzle @solved="puzzleSolved" :key="puzzleColection[currentPuzzle].PuzzleId" :puzzle-data="puzzleColection[currentPuzzle]" />
    <v-row v-show="solved" justify="center">
      <v-btn variant="outlined" @click="nextPuzzle()">Continue</v-btn>
    </v-row>
  </v-container>

</template>
