<script setup lang="ts">
import ChessPuzzle from './ChessPuzzle.vue'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import '@datadog/browser-logs/bundle/datadog-logs'
import { type Puzzle } from '@/types.ts'
import { shuffleArray } from '@/helper'
import { s } from 'unplugin-vue-router/dist/defineLoader-bde635fd.js'

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
    type: Array as () => Puzzle[],
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
const shuffledPuzzles = ref([] as Puzzle[])
const solved = ref(false)
const puzzleRef = ref()
const currentPuzzle = ref({} as Puzzle)
const alert = ref(false)
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

// this alert will be shown when the user (or stockfish) completes all the puzzles
const showAlert = () => {
  alert.value = true
}

/**
 * @description Reset the puzzle parameters
 * @returns {void} 
 */
const resetPuzzleParams = () => {
  solved.value = false
  allowClue.value = false
  currentErrors.value = 0
  puzzleClockRef.value.restart()
}

/**
 * @description Restart the session
 * @returns {void} 
 */
const restartSession = () => {
  resetPuzzleParams()
  totalErrors.value = 0
  totalPuzzless.value = 0
  sessionClockRef.value.restart()
  shuffledPuzzles.value = shuffleArray(props.puzzleColection)
  nextPuzzle()
}

/**
 * @description Show an alert when the user completes all the puzzles
 * @returns {void} 
 */
const nextPuzzle = () => {
  resetPuzzleParams()
  if (shuffledPuzzles.value.length > 0) {
    currentPuzzle.value = shuffledPuzzles.value.pop() as Puzzle
  } else {
    showAlert()
  }
}

/**
 * @description Show an error feedback that will disappear after 1 second
 * @returns {Promise<void>} 
 */
const showError = async () => {
  errorOccurred.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  errorOccurred.value = false
}

/**
 * @description Show a success feedback that will disappear after 1 second
 * @returns {Promise<void>} 
 */
const showSuccess = async () => {
  successOccurred.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  successOccurred.value = false
}

/**
 * @description Handle the feedback when the user fails or completes a puzzle
 * @returns {void} 
 */
const textClasses = computed(() => {
  return {
    'text-lime-500': successOccurred.value,
    'text-rose-800': errorOccurred.value,
  }
})

/**
 * @description It counts the number of errors and enables the clue button (hint)
 * @returns {void} 
 */
const handleFailure = () => {
  if (currentErrors.value == 0) {
    totalErrors.value++
    showError()
  }
  currentErrors.value++
  if (currentErrors.value > 0) allowClue.value = true
  if (auto.value) nextPuzzle()
}

/**
 * @description It gives feedback when the user completes a puzzle. Also, it calculates the rank and saves the data in the local storage
 * @param {number} moves - The number of moves
 * @param {number} failures - The number of failures
 * @returns {void} 
 */
const puzzleSolved = (moves: number, failures: number) => {
  showSuccess()
  totalPuzzless.value++
  solved.value = true
  const timeElapsed = puzzleClockRef.value ? puzzleClockRef.value.stop() : 0
  const rank: number = calculateRank(timeElapsed, moves, failures)
  localStorage.setItem(
    `puzzle_${currentPuzzle.value.PuzzleId}`,
    JSON.stringify({
      rank,
      moves,
      timeElapsed,
      failures,
    }),
  )
  if (auto.value) nextPuzzle()
}

/**
 * @description It calculates the rank based on the time elapsed, the number of moves, and the number of failures
 * @param {number} timeElapsed - The time elapsed
 * @param {number} moves - The number of moves
 * @param {number} failures - The number of failures
 * @returns {number} 
 */
const calculateRank = (
  timeElapsed: number,
  moves: number,
  failures: number,
) => {
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

/**
 * @description It draws a hint on the board
 * @returns {void} 
 */
const sendClue = () => {
  puzzleRef.value.clue()
}

/**
 * @description It shuffles the puzzles and starts the first puzzle
 * @returns {void} 
 */
onBeforeMount(() => {
  shuffledPuzzles.value = shuffleArray(props.puzzleColection)
  nextPuzzle()
})
</script>

<template>
  <v-container fluid class="overflow-hidden">
    <v-alert
      v-model="alert"
      border="start"
      close-label="Close Alert"
      color="#C51162"
      title="Congratulations!"
      variant="tonal"
      icon="mdi-firework"
      density="compact"
      theme="dark"
      closable
      class="max-w-screen-md mt-0 mb-6 p-3"
    >
      You have completed all the puzzles in this collection!
    </v-alert>
    <!-- puzzle timer -->
    <v-row class="grid">
      <v-col
        id="puzzle-timer-container"
        cols="auto"
        class="p-0 text-2xl xxxs:text-xl md:text-3xl font-bold mb-2 md:mb-5 mx-auto w-11/12 md:max-w-sm v-center"
        order-md="1"
      >
        <v-sheet
          :elevation="17"
          :border="true"
          rounded
          class="bg-lime-600 text-gray-900 text-center pb-[3px]"
        >
          <span class="font-semibold mr-2">Puzzle Time:</span>
          <StopWatch ref="puzzleClockRef" />
        </v-sheet>
      </v-col>
      <!-- board -->
      <v-col
        id="chessboard-container"
        class="p-0 mb-3 xxxs:mb-2 md:w-full lg:landscape:max-w-[85vh] 2xl:landscape:max-w-[90vh]"
        order-md="0"
      >
        <ChessPuzzle
          ref="puzzleRef"
          :key="currentPuzzle.PuzzleId"
          :puzzle-data="currentPuzzle"
          @failure="handleFailure"
          @solved="puzzleSolved"
        >
        </ChessPuzzle>
      </v-col>
      <v-col id="puzzle-actions-container" class="p-0 v-center" order-md="2">
        <!-- actions -->
        <v-row
          id="puzzle-actions-row"
          class="flex justify-center items-center xxs:-mt-2 xs:max-w-md xs:mx-auto md:max-w-xl"
        >
          <v-col cols="auto" class="flex justify-center xxxs:px-2 xxs:px-0">
            <v-btn
              size="large"
              rounded="xs"
              color="#3b83f6"
              plain
              append-icon="mdi-lightbulb-alert-outline"
              :disabled="!allowClue"
              class="bg-blue-500 hover:bg-blue-700 text-white text-xl xxs:text-base md:text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              @click="sendClue()"
              >Hint</v-btn
            >
          </v-col>
          <v-col
            cols="auto"
            class="flex justify-center px-2"
            order-lg="2"
            order-xl="0"
          >
            <v-switch
              v-model="auto"
              inset
              label="Auto"
              color="indigo"
              value="Auto"
              hide-details
              class="switch flex justify-center auto-label"
            ></v-switch>
          </v-col>
          <v-col cols="auto" class="flex justify-center xxxs:px-2 xxs:px-0">
            <v-btn
              size="large"
              rounded="xs"
              color="#10b981"
              plain
              append-icon="mdi-skip-next-outline"
              :disabled="!solved"
              class="bg-emerald-500 hover:bg-emerald-700 text-white text-xl xxs:text-base md:text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed xxxs:-mt-4"
              @click="nextPuzzle()"
              >Next</v-btn
            >
          </v-col>
        </v-row>
      </v-col>

      <v-col id="solved-counter" order-md="3" class="v-center">
        <div
          :class="textClasses"
          class="font-bold transition-all duration-300 text-center text-2xl md:text-3xl pb-2"
        >
          Solved: {{ totalPuzzless }}/{{ totalPuzzless + totalErrors }}
        </div>
      </v-col>
      <v-col id="sprint-timer-container" order-md="4" class="v-center">
        <v-row
          class="flex justify-center items-center lg:landscape:gap-4 mx-auto md:max-w-lg lg:landscape:max-w-full"
        >
          <v-col
            class="p-0 text-2xl xxs:text-xl md:text-3xl font-bold mb-2 mx-auto xxs:mr-2"
          >
            <v-sheet
              :elevation="17"
              :border="true"
              rounded
              class="bg-blue-900 text-white text-center pb-[3px] lg:landscape:p-2"
            >
              <span class="font-semibold mr-2">Sprint:</span>
              <StopWatch ref="sessionClockRef" />
            </v-sheet>
          </v-col>
          <v-col cols="auto" class="p-0 px-2 text-center">
            <v-btn
              plain
              size="large"
              color="#e11d48"
              rounded="xs"
              class="bg-rose-600 hover:bg-rose-800 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed xxxs:text-xl md:text-3xl lg:landscape:text-2xl xxxs:mt-1 xxs:-mt-3 -mt-2"
              @click="restartSession()"
              >Restart</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@media screen and (min-width: 960px) {
  .v-center {
    height: 100%;
    display: grid;
    align-content: center;
  }
  .grid {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 15vh);
  }
  #chessboard-container {
    grid-row: 1/6;
    grid-column: 1/5;
  }
  #puzzle-timer-container {
    grid-row: 1;
    grid-column: 5/8;
  }
  #puzzle-actions-container {
    grid-row: 2/4;
    grid-column: 5/8;
  }
  #solved-counter {
    grid-row: 4;
    grid-column: 5/8;
  }
  #sprint-timer-container {
    grid-row: 5/6;
    grid-column: 5/8;
  }
}
</style>
