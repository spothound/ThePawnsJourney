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
const stopwatchRef = ref({
  stop: () => { return(0) },
  restart: () => { return(0)}
});
function nextPuzzle () {
  solved.value = false
  stopwatchRef.value.restart()
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

function puzzleSolved ( moves: number, failures: number) {
  solved.value = true
  const timeElapsed = stopwatchRef.value ? stopwatchRef.value.stop() : 0;
  requiredTime.value = timeElapsed
  puzzleRankings[currentPuzzle.value] = calculateRank(timeElapsed, moves, failures)
  localStorage.setItem(`puzzleRankings_${props.level}`, JSON.stringify(puzzleRankings))
}

onMounted(() => {

})

</script>

<template>
  <v-container class="training">
    <v-row no-gutters class="training" justify="center">
      <v-col sm="3" cols="12" class="text-center">
        hola info about the session
      </v-col>
      <v-col sm="6" cols="12" class="board">
        <ChessPuzzle @solved="puzzleSolved" :key="(puzzleColection[currentPuzzle] as any).PuzzleId" :puzzle-data="(puzzleColection[currentPuzzle] as any)"/>
      </v-col>
      <v-col sm="3" cols="12" class="text-center">
        <v-row no-gutters class="training" justify="center">
          <v-col cols="12" class="board">
            <StopWatch ref="stopwatchRef"/>
          </v-col>
          <v-col cols="12" class="board">
            <v-btn :disabled="!solved" variant="outlined" class="mx-auto" @click="nextPuzzle()">NEXT</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.board{
  justify-content: center;
  align-items: center;
}
.training {
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.text-center {
  text-align: center;
}
</style>
