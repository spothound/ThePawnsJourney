<script setup lang="ts">
import 'vue3-chessboard/style.css'
// @ts-ignore
import { TheChessboard, type BoardConfig, BoardApi, type MoveEvent, MoveableColor, type DrawShape } from 'vue3-chessboard'
import { reactive, onMounted, ref } from 'vue'
import captureSound from '../assets/sounds/capture-sound.mp3'
import confirmationSound from '../assets/sounds/confirmation-sound.mp3'
import errorSound from '../assets/sounds/error-sound.mp3'
import moveSound from '../assets/sounds/move-sound.mp3'

// Parent-child communication
const emit = defineEmits(['solved', 'failure'])
const props = defineProps({
  puzzleData: {
    type: Object,
    required: true
  }
})


// Variables

let boardAPI: BoardApi | undefined
const invalidMove = ref(false)

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
  draggable: { enabled: true },
  orientation: playerColor,
})

// Functions

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
  window.addEventListener('resize', resizeBoard);
  resizeBoard()
  runEnemyMove()
  playerColor = boardAPI?.getLastMove()?.color === 'w' ? 'black' : 'white'
})

function goBack () {
  moves--
  boardAPI?.undoLastMove()
  invalidMove.value = false
}

function clue () {
  if (pendingMoves.length > 0) {
    const nextMove = pendingMoves[0]
        boardAPI?.setShapes([
        {
          orig: nextMove.slice(0, 2),
          dest: nextMove.slice(2, 4),
          brush: 'paleGreen'
        },
      ])
    }
}

defineExpose({ clue });

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
