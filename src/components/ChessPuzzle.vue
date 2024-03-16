<script setup lang="ts">
import 'vue3-chessboard/style.css'
// @ts-ignore
import { TheChessboard, type BoardConfig, BoardApi, type MoveEvent, Color, MoveableColor, type DrawShape } from 'vue3-chessboard'
import { readLichessPuzzleData, type LichessPuzzleData } from '@/types/lichessPuzzle';
import { reactive, onMounted, ref } from 'vue'
import captureSound from '../assets/sounds/capture-sound.mp3'
import confirmationSound from '../assets/sounds/confirmation-sound.mp3'
import errorSound from '../assets/sounds/error-sound.mp3'
import moveSound from '../assets/sounds/move-sound.mp3'

// Parent-child communication
const emit = defineEmits(['solved', 'failure'])
const props = defineProps({
  puzzleId: {
    type: String,
    required: true
  }
})

defineExpose({ clue })

// make a request to lichess open API to retrieve the puzzle information
async function getPuzzleData(puzzleId: string) {
  const response = await fetch(`https://lichess.org/api/puzzle/${puzzleId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const puzzleData = await response.json() as LichessPuzzleData;
  return puzzleData;
}

// Variables
const puzzleData: LichessPuzzleData = await getPuzzleData(props.puzzleId);
const pgnMoves: number = puzzleData.game.pgn.split(' ').length
let pendingMoves: string[] = puzzleData.puzzle.solution
const playerColor = pgnMoves % 2 === 0 ? 'white' as MoveableColor: 'black' as MoveableColor;
let boardAPI: BoardApi | undefined
const invalidMove = ref(false)
const intervalId = setInterval(DetectFailure, 1500)
let failures = 0
let moves = 0
const boardConfig: BoardConfig = reactive({
  coordinates: true,
  viewOnly: false,
  animation: { enabled: true },
  draggable: { enabled: true },
  orientation: playerColor as Color,
})

// Functions
function runPGN(pgn: string) {
  if (boardAPI) {
    boardAPI.loadPgn(pgn)
  }
}

function solvedPuzzle() {
  emit('solved', moves, failures)
  new Audio(confirmationSound).play()
}

function DetectFailure() {
  if (invalidMove.value) {
    invalidMove.value = false
    failures++
    goBack()
  }
}

function runEnemyMove() {
  if (pendingMoves.length === 0) {
    solvedPuzzle()
    return
  }
  const nextMove = pendingMoves[0]
  pendingMoves = pendingMoves.slice(1)
  boardAPI?.move(nextMove)
}

function validMove(move: string): boolean {
  if (pendingMoves.length === 0) {
    return false
  }

  return move === pendingMoves[0]
}

function handlePlayerMove(move: MoveEvent) {
  moves++
  if (boardAPI?.getIsCheckmate()) {
    solvedPuzzle()
    return true
  }
  if (validMove(move.lan)) {
    pendingMoves = pendingMoves.slice(1)
    if('promotion' in move) // this fixes a weird race condition bug on promotion
    {
      setTimeout(runEnemyMove, 200);
    } else {
      runEnemyMove()
    }
  } else {
    invalidMove.value = true
    new Audio(errorSound).play()
    emit('failure')
  }
}

function handleMove(move: MoveEvent) {
  if (move.captured) {
    new Audio(captureSound).play()
  } else {
    new Audio(moveSound).play()
  }
  if (move.color === playerColor[0]) {
    handlePlayerMove(move)
  }
}

// this function find the element with class chessboard-visualization and resize it.
// It check if the element is present in the page and if it has a parent element,
// then it set the width of the chessboard to the width of the parent element.
function resizeBoard() {
  const chessboard = document.querySelector(
    '.chessboard-visualization',
  ) as HTMLElement
  if (chessboard) {
    const parent = chessboard.parentElement
    if (parent) {
      chessboard.style.width = `${parent.clientWidth}px`
    }
  }
}

nextTick(() => {
  resizeBoard()
})

onMounted(async () => {
  runPGN(puzzleData.game.pgn)
  window.addEventListener('resize', resizeBoard)
  resizeBoard()
})

function goBack() {
  moves--
  boardAPI?.undoLastMove()
  invalidMove.value = false
}

function clue() {
  if (pendingMoves.length > 0) {
    const nextMove = pendingMoves[0]
    boardAPI?.setShapes([
      {
        orig: nextMove.slice(0, 2),
        dest: nextMove.slice(2, 4),
        brush: 'paleGreen',
      },
    ])
  }
}

</script>

<template>
  <TheChessboard
    class="chessboard-visualization"
    :player-color="playerColor"
    :board-config="boardConfig"
    reactive-config
    @move="handleMove"
    @board-created="(api: any) => (boardAPI = api)"
  />
</template>

<style scoped>
/* .chessboard-visualization {
  margin: 0px;
  width: 200px;
} */
</style>
