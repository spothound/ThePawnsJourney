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

const auto = ref(false)
const totalErrors = ref(0)
const totalPuzzless = ref(0)
const maxIndex = props.puzzleColection.length - 1
const puzzleRankings = new Array(maxIndex).fill(-1);
const solved = ref(false)
const requiredTime = ref(0)
const currentPuzzle = ref()
const puzzleClockRef = ref({
  stop: () => { return(0) },
  restart: () => { return(0)}
});
const sessionClockRef = ref({
  stop: () => { return(0) },
  restart: () => { return(0)}
});
function nextPuzzle () {
  solved.value = false
  puzzleClockRef.value.restart()
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

function handleFailure () {
  totalErrors.value++
}

function puzzleSolved ( moves: number, failures: number) {
  totalPuzzless.value++
  solved.value = true
  const timeElapsed = puzzleClockRef.value ? puzzleClockRef.value.stop() : 0;
  requiredTime.value = timeElapsed
  puzzleRankings[currentPuzzle.value] = calculateRank(timeElapsed, moves, failures)
  localStorage.setItem(`puzzleRankings_${props.level}`, JSON.stringify(puzzleRankings))
  if(auto.value)
    nextPuzzle()
}

onMounted(() => {

})

</script>

<template>
  <v-container class="training">
    <v-row no-gutters class="training" justify="center">
      <v-col sm="3" cols="12" class="text-center">
        <v-row>
          <v-col cols="12">
            Session Time: <br/>
            <StopWatch ref="sessionClockRef"/>
          </v-col>
          <v-col cols="12">
            N Puzzles: {{totalPuzzless}}
          </v-col>
          <v-col cols="12">
            N Errors: {{totalErrors}}
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="6" cols="12" class="board">
        <ChessPuzzle @failure="handleFailure" @solved="puzzleSolved" :key="(puzzleColection[currentPuzzle] as any).PuzzleId" :puzzle-data="(puzzleColection[currentPuzzle] as any)"/>
      </v-col>
      <v-col sm="3" cols="12" class="text-center">
        <v-row no-gutters class="training" justify="center">
          <v-col cols="12">
            Puzzle Time: <br/>
            <StopWatch ref="puzzleClockRef"/>
          </v-col>
          <v-col cols="12" >
            <v-btn :disabled="!solved" variant="outlined" @click="nextPuzzle()">NEXT</v-btn>
            <v-switch inset class=switch v-model="auto" label="auto"></v-switch>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.switch{
  display: flex;
  justify-content: center;
}
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
