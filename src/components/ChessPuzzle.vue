<script setup lang="ts">
import { shortToLongColor } from '@/helper.ts'
import type { BoardConfig, MoveEvent, SquareKey } from 'vue3-chessboard'
import { TheChessboard, BoardApi } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'
import type { Puzzle, TurnColor } from '@/types.ts'
import { reactive, onMounted } from 'vue'
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
const originalExpectedMoves = props.puzzleData.Moves.split(' ')
const enemyColor: TurnColor = props.puzzleData.FEN.split(' ')[1] as TurnColor
const playerColor: TurnColor = enemyColor === 'w' ? 'b' : 'w'
// the opposite of the first move color, because the first move is made by the board
const fullPlayerColor = shortToLongColor(playerColor)

// function to get odd moves from the array
function getOddMoves(moves: string[]): string[] {
  return moves.filter((_, index) => index % 2 === 0)
}
// function to get even moves from the array
function getEvenMoves(moves: string[]): string[] {
  return moves.filter((_, index) => index % 2 !== 0)
}
const pendingEnemyMoves = getOddMoves(originalExpectedMoves)
const pendingPlayerMoves = getEvenMoves(originalExpectedMoves)

let failures = 0
let moves = 0

function handleBoardCreated(boardApi: BoardApi) {
  boardAPI = boardApi
}

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
  orientation: fullPlayerColor,
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
})

function runEnemyMove() {
  const nextMove = pendingEnemyMoves.shift() as string
  boardAPI?.move(nextMove)
}

function handleMove(move: MoveEvent) {
  if (move.captured) {
    new Audio(captureSound).play()
  } else {
    new Audio(moveSound).play()
  }
  if (boardAPI?.getTurnColor() !== fullPlayerColor) {
    const playerMoveShouldBe = pendingPlayerMoves.shift()
    if (move?.lan === playerMoveShouldBe && pendingEnemyMoves.length > 0) {
      moves++
      setTimeout(() => {
        runEnemyMove()
      }, 200)
    } else {
      if (
        boardAPI?.getIsCheckmate() ||
        boardAPI?.getIsStalemate() ||
        boardAPI?.getIsInsufficientMaterial() ||
        boardAPI?.getIsDraw() ||
        boardAPI?.getIsThreefoldRepetition() ||
        (move.lan === playerMoveShouldBe && pendingEnemyMoves.length === 0)
        // boardAPI?.getIsFiftyMoveRule() //check if vue3-chessboard has this method. If not, create it.
      ) {
        moves++
        emit('solved', moves, failures)
        new Audio(confirmationSound).play()
      } else {
        new Audio(errorSound).play()
        failures++
        pendingPlayerMoves.unshift(playerMoveShouldBe as string)
        moves--
        setTimeout(() => {
          boardAPI?.undoLastMove()
          const history = boardAPI?.getHistory()
          emit('failure', history, originalExpectedMoves)
        }, 200)
      }
    }
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

function clue() {
  const from: SquareKey = pendingPlayerMoves[0].slice(0, 2) as SquareKey
  const to: SquareKey = pendingPlayerMoves[0].slice(2, 4) as SquareKey
  boardAPI?.setShapes([
    {
      orig: from,
      dest: to,
      brush: 'paleGreen',
    },
  ])
}

defineExpose({ clue })

nextTick(() => {
  resizeBoard()
})

onMounted(async () => {
  window.addEventListener('resize', resizeBoard)
  runEnemyMove()
})
</script>

<template>
  <TheChessboard
    class="chessboard-visualization"
    :board-config="boardConfig"
    :player-color="fullPlayerColor"
    reactive-config
    @move="handleMove"
    @board-created="handleBoardCreated"
  />
</template>
