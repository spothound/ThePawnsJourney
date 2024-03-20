<script setup lang="ts">
import 'vue3-chessboard/style.css'
import { Stockfish } from '@/engines/Stockfish'
import { type Puzzle } from '@/types.ts'
// @ts-ignore
import type { MoveableColor } from 'vue3-chessboard'
import {
  TheChessboard,
  type BoardConfig,
  BoardApi,
  type MoveEvent,
} from 'vue3-chessboard'
import { reactive, onMounted, ref } from 'vue'
import captureSound from '../assets/sounds/capture-sound.mp3'
import confirmationSound from '../assets/sounds/confirmation-sound.mp3'
import errorSound from '../assets/sounds/error-sound.mp3'
import moveSound from '../assets/sounds/move-sound.mp3'

// Parent-child communication
const emit = defineEmits(['solved', 'failure'])
const props = defineProps({
  puzzleData: {
    type: Object as PropType<Puzzle>,
    required: true,
  },
})

// Variables

let boardAPI: BoardApi | undefined
let engine: Stockfish | undefined

// the opposite of the first move color, because the first move is made by the board
let playerColor: MoveableColor =
  props.puzzleData.FEN.split(' ')[1] === 'b' ? 'white' : 'black'

function handleBoardCreated(boardApi: BoardApi) {
  boardAPI = boardApi
  engine = new Stockfish(boardApi, playerColor)
}

let pendingMoves = props.puzzleData.Moves.split(' ')
let moves = 0
const boardConfig: BoardConfig = reactive({
  fen: props.puzzleData.FEN,
  coordinates: true,
  viewOnly: false,
  highlight: {
    lastMove: true, // highlight the last move on the board
    check: true, // highlight king in check
  },
  animation: {
    enabled: true,
    duration: 200,
  },
  draggable: {
    enabled: true,
    distance: 3,
    autoDistance: true,
    showGhost: true,
    deleteOnDropOff: false,
  },
  premovable: {
    enabled: true,
    showDests: true,
    castle: true,
    events: {},
  },
  selectable: {
    enabled: true,
  },
  orientation: playerColor,
  brushes: {
    green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
    red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
    blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
    yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
    paleBlue: { key: 'pb', color: '#003088', opacity: 0.4, lineWidth: 15 },
    paleGreen: { key: 'pg', color: '#15781B', opacity: 0.4, lineWidth: 15 },
    paleRed: { key: 'pr', color: '#882020', opacity: 0.4, lineWidth: 15 },
    paleGrey: {
      key: 'pgr',
      color: '#4a4a4a',
      opacity: 0.35,
      lineWidth: 15,
    },
  },
  events: {
    move: (from, to, capture) => {
      // the move function fires after each move on the board, you can access the values from, to, and capture
      // use @move event to access values from the board api. The move function is executed before the state is updated in the board.
      // console.log(from, to, capture)
    },
  },
})

// Functions
function solvedPuzzle() {
  emit('solved', moves)
  new Audio(confirmationSound).play()
  // engine?.confirmNewGame(playerColor[0] === 'w' ? 'white' : 'black')
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
  if (
    boardAPI?.getIsCheckmate() ||
    boardAPI?.getIsStalemate() ||
    boardAPI?.getIsInsufficientMaterial() ||
    boardAPI?.getIsDraw() ||
    boardAPI?.getIsThreefoldRepetition()
  ) {
    solvedPuzzle()
    return true
  }
  if (validMove(move.lan)) {
    pendingMoves = pendingMoves.slice(1)
    runEnemyMove()
  } else {
    // invalidMove.value = true
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
  // console.log('handleMove', move)
  // console.log('player color: ', playerColor);
  // console.log('engine color: ', engine?.getPlayerColor());

  if (playerColor !== engine?.getPlayerColor()) {
    engine?.setPlayerColor(playerColor)
  }
  // console.log(boardAPI?.getFen())
  engine?.sendUserMove(boardAPI?.getFen() as string, move.lan)
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
  engine?.confirmNewGame()
  engine?.setPlayerColor(playerColor)
  window.addEventListener('resize', resizeBoard)
  resizeBoard()
  runEnemyMove()
  playerColor = boardAPI?.getLastMove()?.color === 'w' ? 'black' : 'white'
})

const logInfo = () => {
  console.log('boardAPI', boardAPI)
  console.log('engine', engine)
}

onBeforeMount(() => {
  console.log('before mount')
})
onBeforeUpdate(() => {
  console.log('before update')
})
onBeforeUnmount(() => {
  console.log('before unmount')
  engine?.destroy()
})
</script>

<template>
  <TheChessboard
    class="chessboard-visualization"
    :board-config="boardConfig"
    reactive-config
    @move="handleMove"
    @board-created="handleBoardCreated"
  />
</template>
