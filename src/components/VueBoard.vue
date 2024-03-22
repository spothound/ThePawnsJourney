<script setup lang="ts">
import type { Puzzle, TurnColor } from '@/types.ts'
import { shortToLongColor } from '@/helper.ts'
import type { MoveableColor, BoardConfig, MoveEvent } from 'vue3-chessboard'
import { Stockfish } from '@/engines/Stockfish'
import 'vue3-chessboard/style.css'
import { TheChessboard, BoardApi } from 'vue3-chessboard'
import { reactive, onMounted, ref } from 'vue'
// import captureSound from '../assets/sounds/capture-sound.mp3'
// import confirmationSound from '../assets/sounds/confirmation-sound.mp3'
import errorSound from '../assets/sounds/error-sound.mp3'
// import moveSound from '../assets/sounds/move-sound.mp3'

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

function handleBoardCreated(boardApi: BoardApi) {
  boardAPI = boardApi
  engine = new Stockfish(boardApi, fullPlayerColor)
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
  // if it's the player's turn, send the enemy move to the engine
  if (boardAPI?.getTurnColor() === fullPlayerColor) {
    if (fullPlayerColor !== engine?.getPlayerColor()) {
      engine?.setPlayerColor(playerColor)
    }
    engine?.sendUserMove(boardAPI?.getFen() as string, move.lan)
  } else {
    const lastPlayerMove = boardAPI?.getLastMove()
    const playerMoveShouldBe = pendingPlayerMoves.shift()
    if (
      lastPlayerMove?.lan === playerMoveShouldBe &&
      pendingEnemyMoves.length > 0
    ) {
      runEnemyMove()
    } else {
      // TODO: check this validations in lichess discord channel
      // The question is: are there puzzles that end with stalemate,
      // insufficient material, draw, threefold repetition, or fifty-move rule?
      if (
        boardAPI?.getIsCheckmate() ||
        boardAPI?.getIsStalemate() ||
        boardAPI?.getIsInsufficientMaterial() ||
        boardAPI?.getIsDraw() ||
        boardAPI?.getIsThreefoldRepetition() ||
        (lastPlayerMove?.lan === playerMoveShouldBe &&
          pendingEnemyMoves.length === 0)
        // boardAPI?.getIsFiftyMoveRule() //check if vue3-chessboard has this method. If not, create it.
      ) {
        emit('solved')
      } else {
        new Audio(errorSound).play()
        console.log('Error')
        console.log('current fen', boardAPI?.getFen())

        console.log('lastPlayerMove', lastPlayerMove)
        console.log('playerMoveShouldBe', playerMoveShouldBe)
        const history = boardAPI?.getHistory()
        console.log('history', history);        
        emit('failure', history, originalExpectedMoves)
      }
    }
  }
}

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
  engine?.setPlayerColor(fullPlayerColor)
  window.addEventListener('resize', resizeBoard)
  runEnemyMove()
  const errorSoundPlayer:HTMLAudioElement = new Audio(errorSound)
  // resizeBoard()
})

onBeforeUnmount(() => {
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
