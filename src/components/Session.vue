<script setup lang="ts">
const router = useRouter();
import { ref } from 'vue'
import Puzzle from './Puzzle.vue'


let puzzleColection = JSON.parse(localStorage.getItem('puzzleColection') as string);

const auto = ref(false)
const totalErrors = ref(0)
const currentErrors = ref(0)
const errorOccurred = ref(false)
const successOccurred = ref(false)
const totalPuzzless = ref(0)
const solved = ref(false)
const puzzleRef = ref()
const requiredTime = ref(0)
const currentPuzzle = ref(0)

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
  currentErrors.value = 0
  puzzleClockRef.value.restart()
  currentPuzzle.value = currentPuzzle.value + 1
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

function handleFailure() {
  if (currentErrors.value == 0) {
    totalErrors.value++
    showError()
  }
  currentErrors.value++
  if (auto.value) nextPuzzle()
}

function puzzleSolved(moves: number, failures: number) {
  showSuccess()
  totalPuzzless.value++
  currentErrors.value = 0
  solved.value = true
  const timeElapsed = puzzleClockRef.value ? puzzleClockRef.value.stop() : 0
  requiredTime.value = timeElapsed
  if (auto.value) nextPuzzle()
}

function restartSession() {
  totalErrors.value = 0
  totalPuzzless.value = 0
  sessionClockRef.value.restart()
  nextPuzzle()
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
        <Suspense>
          <template #default>
            <Puzzle
              :key="currentPuzzle"
              ref="puzzleRef"
              @failure="handleFailure"
              @solved="puzzleSolved"
              :puzzleId="puzzleColection[currentPuzzle]['PuzzleId']"
            />
          </template>
          <template #fallback>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </template>
        </Suspense>
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
