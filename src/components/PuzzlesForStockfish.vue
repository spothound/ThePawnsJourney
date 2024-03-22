<script setup lang="ts">
import VueBoard from './VueBoard.vue'
import { ref } from 'vue'
import { type Puzzle } from '@/types.ts'

const props = defineProps({
  chunk: {
    type: Number,
    required: true,
  },
  puzzleColection: {
    type: Array as () => Puzzle[],
    required: true,
  },
})

const squareIcon = ref(['mdi-circle']) // feedback for the user
const auto = ref(true) // auto start next puzzle
const totalErrors = ref(0)
const currentPuzzle = ref({} as Puzzle)
const currentPuzzleIndex = ref(0)
const maxIndex = props.puzzleColection.length - 1 // last available puzzle
const solved = ref(false)
const puzzleRef = ref()
const totalPuzzless = ref(0)
const alert = ref(false)
const whiteToMove = ref(true)
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
function nextPuzzle() {
  solved.value = false
  puzzleClockRef.value.restart()
  currentPuzzle.value = props.puzzleColection[currentPuzzleIndex.value]
  whiteToMove.value =
    (props.puzzleColection[currentPuzzleIndex.value] as Puzzle).FEN.split(
      ' ',
    )[1] !== 'w'
  if (currentPuzzleIndex.value < maxIndex) {
    currentPuzzleIndex.value++
  } else {
    showAlert()
  }
}

function handleFailure(history: string[], originalExpectedMoves: string[]) {
  totalErrors.value++
  reportPuzzle(
    currentPuzzle.value.PuzzleId,
    history,
    originalExpectedMoves,
  )
  if (auto.value) nextPuzzle()
}

function puzzleSolved() {
  solved.value = true
  totalPuzzless.value++
  if (auto.value) nextPuzzle()
}

function restartSession() {
  totalErrors.value = 0
  totalPuzzless.value = 0
  currentPuzzleIndex.value = 0
  sessionClockRef.value.restart()
  nextPuzzle()
}

const reportPuzzle = (
  id: string,
  history: string[] = [],
  expectedMoves: string[] = [],
) => {
  console.log(`Report puzzle: ${id}`)
  console.log(`History: ${history}`)
  console.log(`Expected moves: ${expectedMoves}`)

  // save to local storage
  localStorage.setItem(
    `puzzleReport_${id}`,
    JSON.stringify({
      id,
      chunk: props.chunk,
      date:
        new Date().toLocaleDateString() +
        ' - ' +
        new Date().toLocaleTimeString(),
      history,
      expectedMoves,
      puzzleIndex: currentPuzzleIndex.value,
    }),
  )
}

onBeforeMount(() => {
  nextPuzzle()
})
</script>

<template>
  <v-container fluid class="overflow-hidden">
    <v-alert
      v-model="alert"
      border="start"
      close-label="Close Alert"
      color="deep-purple-accent-4"
      title="Closable Alert"
      variant="tonal"
      closable
      class="max-w-screen-md my-4 mx-auto p-3"
    >
      You have completed all the puzzles in this collection!
    </v-alert>
    <v-row class="grid">
      <!-- puzzle timer -->
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
        <VueBoard
          ref="puzzleRef"
          :key="currentPuzzle.PuzzleId"
          :puzzle-data="currentPuzzle"
          @failure="handleFailure"
          @solved="puzzleSolved"
        >
        </VueBoard>
      </v-col>
      <v-col id="puzzle-actions-container" class="p-0 v-center" order-md="2">
        <!-- actions -->
        <v-row
          id="puzzle-actions-row"
          class="flex justify-center items-center xxs:-mt-2 xs:max-w-md xs:mx-auto md:max-w-xl"
        >
          <v-col cols="auto" class="flex justify-center xxxs:px-2 xxs:px-0">
            <div class="flex justify-center items-center">
              <v-icon
                class="text-2xl mr-2 border-2 border-blue-900 rounded-md p-[2px] border-opacity-80 bg-blue-900"
                :class="{
                  'text-white': whiteToMove,
                  'text-black': !whiteToMove,
                }"
                :icon="squareIcon"
              />
              <p class="xxxs:text-xl text-xl font-kanit font-bold opacity-90">
                {{ whiteToMove ? 'White' : 'Black' }} to move
              </p>
            </div>
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
              :label-value="auto"
              hide-details
              class="switch flex justify-center auto-label"
            ></v-switch>
          </v-col>
          <v-col cols="auto" class="flex justify-center xxxs:px-2 xxs:px-0">
            <v-btn
              color="red"
              class="bg-slate-600 hover:bg-slate-800 text-white font-bold xxxs:text-xl md:text-3xl lg:landscape:text-xl xxxs:mt-1 xxs:-mt-3 -mt-2"
              @click="reportPuzzle(currentPuzzle.PuzzleId)"
            >
              Puzzle:
              {{
                currentPuzzle.PuzzleId
                  ? currentPuzzle.PuzzleId
                  : 'No puzzle selected'
              }}
              <v-tooltip activator="parent" location="top"
                >Report this puzzle</v-tooltip
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col id="solved-counter" order-md="3" class="v-center">
        <div
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
