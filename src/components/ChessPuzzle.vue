<script setup lang="ts">
import 'vue3-chessboard/style.css'
// @ts-ignore
import { TheChessboard, type BoardConfig, BoardApi, type MoveEvent, MoveableColor } from 'vue3-chessboard'
import { defineProps, reactive, onMounted, ref, defineEmits } from 'vue'
import captureSound from '../assets/sounds/capture-sound.mp3'
import confirmationSound from '../assets/sounds/confirmation-sound.mp3'
import errorSound from '../assets/sounds/error-sound.mp3'
import moveSound from '../assets/sounds/move-sound.mp3'

// Parent-child communication
const emit = defineEmits(['solved'])
const props = defineProps({
  puzzleData: {
    type: Object,
    required: true
  }
})


// Variables

let boardAPI: BoardApi | undefined
const invalidMove = ref(false)
const stopwatchRef = ref({ stop: () => {return(0)} });
const intervalId = setInterval(DetectFailure, 1500);
let playerColor: MoveableColor = props.puzzleData.FEN.split(' ')[1] === 'b' ? 'white' : 'black'
let pendingMoves = props.puzzleData.Moves.split(' ')
let failures = 0
let moves = 0
const boardConfig: BoardConfig = reactive({
  fen: props.puzzleData.FEN,
  coordinates: true,
  viewOnly: false,
  animation: { enabled: true },
  draggable: { enabled: true }
})

// Functions

function solvedPuzzle () {
  const timeElapsed = stopwatchRef.value ? stopwatchRef.value.stop() : 0;
  emit('solved', timeElapsed, moves, failures);
  new Audio(confirmationSound).play()
}

function DetectFailure() {
  if(invalidMove.value) {
    invalidMove.value = false
    failures++
    goBack()
  }
}

function runEnemyMove () {
  if (pendingMoves.length === 0) {
    solvedPuzzle()
    return
  }
  const nextMove = pendingMoves[0]
  pendingMoves = pendingMoves.slice(1)
  boardAPI?.move(nextMove)
}

function validMove (move: string): boolean {
  if (pendingMoves.length === 0) {
    return false
  }

  return move === pendingMoves[0]
}

function handlePlayerMove (move: MoveEvent) {
  moves++
  if (boardAPI?.getIsCheckmate()) {
    solvedPuzzle()
    return true
  }
  if (validMove(move.lan)) {
    pendingMoves = pendingMoves.slice(1)
    runEnemyMove()
  } else {
    invalidMove.value = true
    new Audio(errorSound).play()
  }
}

function handleMove (move: MoveEvent) {
  if (move.captured) {
    new Audio(captureSound).play()
  } else {
    new Audio(moveSound).play()
  }
  if (move.color === playerColor[0]) {
    handlePlayerMove(move)
  }
}

onMounted(() => {
  runEnemyMove()
  playerColor = boardAPI?.getLastMove()?.color === 'w' ? 'black' : 'white'
})

function goBack () {
  boardAPI?.undoLastMove()
  invalidMove.value = false
}

</script>

<template>
  <v-container class="full-size center-text">
    <v-row justify="center">
      <v-col cols="12">
        <StopWatch ref="stopwatchRef"/>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <TheChessboard class="full-size test" @move="handleMove" @board-created="(api: any) => (boardAPI = api)" :player-color="playerColor"
          :board-config="boardConfig" reactive-config />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.full-size {
  width: 100%;
}
.center-text {
  text-align: center;
}
</style>
