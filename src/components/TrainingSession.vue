<script setup lang="ts">
import ChessPuzzle from './ChessPuzzle.vue'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import '@datadog/browser-logs/bundle/datadog-logs'

const sessionToken = localStorage.getItem('sessionToken') || uuidv4()
localStorage.setItem('sessionToken', sessionToken)

declare global {
  interface Window {
    DD_LOGS: any
  }
}

window.DD_LOGS.init({
  clientToken: 'pubc17749f9323600ef9e82cfd995039870',
  site: 'us5.datadoghq.com',
  forwardErrorsToLogs: true,
  sessionSampleRate: 100,
})

window.DD_LOGS.logger.info('User connected', { sessionToken: sessionToken })
console.log('User connected', { sessionToken: sessionToken })

const props = defineProps({
  level: {
    type: Number,
    required: true,
  },
  puzzleColection: {
    type: Array,
    required: true,
  },
})

const auto = ref(false)
const totalErrors = ref(0)
const currentErrors = ref(0)
const allowClue = ref(false)
const errorOccurred = ref(false)
const successOccurred = ref(false)
const totalPuzzless = ref(0)
const maxIndex = props.puzzleColection.length - 1
const puzzleRankings = new Array(maxIndex).fill(-1)
const solved = ref(false)
const puzzleRef = ref()
const requiredTime = ref(0)
const currentPuzzle = ref()
const puzzleClockRef = ref({
  stop: () => {
    return 0
  },
  restart: () => {
    return 0
  },
})
const sessionClockRef = ref({
  stop: () => {
    return 0
  },
  restart: () => {
    return 0
  },
})
function nextPuzzle() {
  solved.value = false
  allowClue.value = false
  currentErrors.value = 0
  puzzleClockRef.value.restart()
  // get an array of indices where puzzleRankings equals -1
  const unplayedPuzzles = puzzleRankings
    .map((ranking, index) => (ranking === -1 ? index : -1))
    .filter((index) => index !== -1)
  // if there are no unplayed puzzles, do nothing
  if (unplayedPuzzles.length === 0)
    Math.floor(Math.random() * puzzleRankings.length)
  // get a random index from unplayedPuzzles
  const randomIndex = Math.floor(Math.random() * unplayedPuzzles.length)
  currentPuzzle.value = unplayedPuzzles[randomIndex]
}

nextPuzzle()

async function showError() {
  errorOccurred.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  errorOccurred.value = false
}

async function showSuccess() {
  successOccurred.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  successOccurred.value = false
}

function calculateRank(timeElapsed: number, moves: number, failures: number) {
  let rank = 0
  const averageTime = timeElapsed / moves
  if (failures > 1) rank = 0
  else if (failures == 1) rank = 1
  else if (averageTime < 3500) rank = 5
  else if (averageTime < 7000) rank = 4
  else if (averageTime < 10000) rank = 3
  else rank = 2
  return rank
}

function handleFailure() {
  if (currentErrors.value == 0) {
    totalErrors.value++
    showError()
  }
  currentErrors.value++
  if (currentErrors.value > 0) allowClue.value = true
  if (auto.value) nextPuzzle()
}

function puzzleSolved(moves: number, failures: number) {
  showSuccess()
  totalPuzzless.value++
  currentErrors.value = 0
  solved.value = true
  const timeElapsed = puzzleClockRef.value ? puzzleClockRef.value.stop() : 0
  requiredTime.value = timeElapsed
  puzzleRankings[currentPuzzle.value] = calculateRank(
    timeElapsed,
    moves,
    failures,
  )
  localStorage.setItem(
    `puzzleRankings_${props.level}`,
    JSON.stringify(puzzleRankings),
  )
  if (auto.value) nextPuzzle()
}

function restartSession() {
  totalErrors.value = 0
  totalPuzzless.value = 0
  puzzleRankings.fill(-1)
  localStorage.setItem(
    `puzzleRankings_${props.level}`,
    JSON.stringify(puzzleRankings),
  )
  sessionClockRef.value.restart()
  nextPuzzle()
}

function sendClue() {
  puzzleRef.value.clue()
}
</script>

<template>
  <v-container class="training">
    <v-row no-gutters class="training" justify="center">
      <v-col sm="3" cols="12" class="text-center">
        <v-row>
          <v-col cols="12">
            Session Time:
            <StopWatch ref="sessionClockRef" />
            <br />
            <v-btn variant="outlined" @click="restartSession()"
              >Restart Session</v-btn
            >
          </v-col>
          <v-col cols="12">
            <div :class="{ success: successOccurred }">
              Puzzles: {{ totalPuzzless }}
            </div>
            <div :class="{ error: errorOccurred }">
              Errors: {{ totalErrors }}
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="6" cols="12" class="board">
        <ChessPuzzle
          ref="puzzleRef"
          @failure="handleFailure"
          @solved="puzzleSolved"
          :key="(puzzleColection[currentPuzzle] as any).PuzzleId"
          :puzzle-data="puzzleColection[currentPuzzle] as any"
        />
      </v-col>
      <v-col sm="3" cols="12" class="text-center">
        <v-row no-gutters class="training" justify="center">
          <v-col cols="12">
            <v-switch
              inset
              class="switch"
              v-model="auto"
              label="auto"
            ></v-switch>
            Puzzle Time:
            <StopWatch ref="puzzleClockRef" />
          </v-col>
          <v-col cols="12">
            <v-btn :disabled="!solved" variant="outlined" @click="nextPuzzle()"
              >NEXT</v-btn
            >
            <v-btn :disabled="!allowClue" variant="outlined" @click="sendClue()"
              >clue</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.success {
  color: green;
}
.error {
  color: red;
}
.switch {
  display: flex;
  justify-content: center;
}
.board {
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
