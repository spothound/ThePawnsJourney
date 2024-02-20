<script setup lang="ts">
import 'vue3-chessboard/style.css'

// @ts-ignore
import { TheChessboard, type BoardConfig, BoardApi, type MoveEvent, MoveableColor, type DrawShape } from 'vue3-chessboard'
import { reactive, onMounted, ref } from 'vue'
import captureSound from '../assets/sounds/capture-sound.mp3'
import confirmationSound from '../assets/sounds/confirmation-sound.mp3'
import errorSound from '../assets/sounds/error-sound.mp3'
import moveSound from '../assets/sounds/move-sound.mp3'
import { readLichessPuzzleData, type LichessPuzzleData } from '@/types/lichessPuzzle';

// Parent-child communication
const emit = defineEmits(['solved', 'failure'])
const props = defineProps({
  puzzleId: {
    type: String,
    required: true
  }
})

// make a request to lichess open API to retrieve the puzzle information
async function getPuzzleData(puzzleId: string) {
  const response = await fetch(`https://lichess.org/api/puzzle/${puzzleId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const puzzleData = await response.json() as LichessPuzzleData;
  return puzzleData;
}

let puzzleData: LichessPuzzleData | undefined;
let playerColor: MoveableColor = 'white';
let pendingMoves: string[] = []
let pgnMoves: number = 0

// Variables
let boardAPI: BoardApi | undefined
const invalidMove = ref(false)
const intervalId = setInterval(DetectFailure, 1500);
let failures = 0
let moves = 0
const boardConfig: BoardConfig = reactive({
  coordinates: true,
  viewOnly: false,
  animation: { enabled: true },
  draggable: { enabled: true },
  orientation: playerColor,
})

// Functions

function runPGN(pgn: string) {
  if (boardAPI) {
    boardAPI.loadPgn(pgn)
  }
}

function solvedPuzzle () {
  emit('solved', moves, failures);
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
    emit('failure')
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

function resizeBoard() {
  // this function find the element with class chessboard-visualization and resize it. It check if the element is present in the page and the width and height of its parent and set the width of the chessboard to the minimum between the two of them
  const chessboard = document.getElementsByClassName('chessboard-visualization')[0] as HTMLElement
  if (chessboard) {
    const main = document.getElementsByClassName('v-main')[0] as HTMLElement
    const parent = chessboard.parentElement
    if (main && parent) {
      const chessboardParentWidth = parent.clientWidth
      const chessboardParentHeight = parent.clientHeight
      const mainHeight = main.clientHeight
      const mainWidth = main.clientWidth
      chessboard.style.width = `${Math.max(chessboardParentWidth, mainHeight)}px`;
      chessboard.style.maxWidth = `${Math.min(chessboardParentWidth, mainHeight, 900)}px`;
    }
  }
}

nextTick(() => {
  resizeBoard()
})

onMounted(async () => {

  puzzleData = await getPuzzleData(props.puzzleId);

  pgnMoves = puzzleData.game.pgn.split(' ').length
  pendingMoves = puzzleData.puzzle.solution
  playerColor = pgnMoves % 2 === 0 ? 'white' : 'black';

  runPGN(puzzleData.game.pgn)

  window.addEventListener('resize', resizeBoard);
  resizeBoard()
  playerColor = boardAPI?.getLastMove()?.color === 'w' ? 'black' : 'white'
  console.log('mounted')
})

function goBack () {
  moves--
  boardAPI?.undoLastMove()
  invalidMove.value = false
}

</script>

<template>
  <TheChessboard class="chessboard-visualization" @move="handleMove" @board-created="(api: any) => (boardAPI = api)" :player-color="playerColor" :board-config="boardConfig" reactive-config />
</template>

<style scoped>
.chessboard-visualization {
  margin: 0px;
  width: 200px;
}
</style>
