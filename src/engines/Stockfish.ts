import { type BoardApi } from 'vue3-chessboard'
import { type SquareKey } from 'vue3-chessboard'

export class Stockfish {
  private stockfish: Worker | undefined
  private boardApi: BoardApi | undefined
  public bestMove: string | null = null
  public engineName: string | null = 'Stockfish 16'
  public colorToMove: string | null = null

  constructor(boardApi: BoardApi, colorToMove: string | null = null) {
    // console.info('Stockfish engine initialized')
    // console.info('colorToMove: ', colorToMove)
    this.colorToMove = colorToMove
    this.boardApi = boardApi
    // const wasmSupported =
    //   typeof WebAssembly === 'object' &&
    //   WebAssembly.validate(
    //     Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
    //   )

    // this.stockfish = new Worker('stockfish.js')
    this.stockfish = new Worker('stockfish.wasm.js')
    // this.stockfish = new Worker(
    //   this.wasmThreadsSupported() ? 'stockfish.wasm.js' : 'stockfish.js',
    // )

    this.setupListeners()
    ;(this.stockfish as Worker).postMessage('uci')
  }
  private wasmThreadsSupported() {
    // WebAssembly 1.0
    const source = Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
    if (
      typeof WebAssembly !== 'object' ||
      typeof WebAssembly.validate !== 'function'
    )
      return false
    if (!WebAssembly.validate(source)) return false

    // SharedArrayBuffer
    if (typeof SharedArrayBuffer !== 'function') return false

    // Atomics
    if (typeof Atomics !== 'object') return false

    // Shared memory
    const mem = new WebAssembly.Memory({
      shared: true,
      initial: 8,
      maximum: 16,
    })
    if (!(mem.buffer instanceof SharedArrayBuffer)) return false

    // Structured cloning
    try {
      // You have to make sure nobody cares about these messages!
      window.postMessage(mem, '*')
    } catch (e) {
      return false
    }

    // Growable shared memory (optional)
    try {
      mem.grow(8)
    } catch (e) {
      return false
    }

    return true
  }

  private setupListeners(): void {
    ;(this.stockfish as Worker).addEventListener('message', (data) =>
      this.handleEngineStdout(data),
    )
    ;(this.stockfish as Worker).addEventListener('error', (err) =>
      console.error(err),
    )
    ;(this.stockfish as Worker).addEventListener('messageerror', (err) =>
      console.error(err),
    )
  }

  private handleEngineStdout(data: MessageEvent<unknown>) {
    const uciStringSplitted = (data.data as string).split(' ')
    // console.info('Stockfish message: ', data.data)
    if (uciStringSplitted[0] === 'uciok') {
      this.setOption('UCI_AnalyseMode', 'true')
      this.setOption('Analysis Contempt', 'Off')
      ;(this.stockfish as Worker).postMessage('ucinewgame')
      ;(this.stockfish as Worker).postMessage('isready')
      return
    }

    if (uciStringSplitted[0] === 'readyok') {
      // ;(this.stockfish as Worker).postMessage('go depth 20')
      ;(this.stockfish as Worker).postMessage('go movetime 2000')
      return
    }

    if (uciStringSplitted[0] === 'bestmove' && uciStringSplitted[1]) {
      if (uciStringSplitted[1] !== this.bestMove) {
        this.bestMove = uciStringSplitted[1]
        if ((this.boardApi as BoardApi).getTurnColor() === this.colorToMove) {
          // console.info('Stockfish best move: ', data.data)
          if (this.bestMove.length === 4 && this.bestMove !== '0000') {
            ;(this.boardApi as BoardApi).move({
              from: this.bestMove.slice(0, 2) as SquareKey,
              to: this.bestMove.slice(2, 4) as SquareKey,
            })
          } else if (this.bestMove.length === 5) {
            // include promotion for char 5
            ;(this.boardApi as BoardApi).move({
              from: this.bestMove.slice(0, 2) as SquareKey,
              to: this.bestMove.slice(2, 4) as SquareKey,
              promotion: this.bestMove[4] as 'q' | 'r' | 'b' | 'n',
            })
          }
        }
      }
    }
  }

  private setOption(name: string, value: string): void {
    ;(this.stockfish as Worker).postMessage(
      `setoption name ${name} value ${value}`,
    )
  }

  public sendUserMove(position: string, move: string) {
    ;(this.stockfish as Worker).postMessage(
      `position fen ${position} moves ${move}`,
    )
    // ;(this.stockfish as Worker).postMessage('go depth 20')
    ;(this.stockfish as Worker).postMessage('go movetime 2000')
  }

  public confirmNewGame() {
    // console.info('confirmNewGame')
    ;(this.stockfish as Worker).postMessage('ucinewgame')
  }
  public setPlayerColor(playerColor: string | null = null) {
    this.colorToMove = playerColor
  }
  public getPlayerColor() {
    return this.colorToMove
  }
  public stopEngine() {
    ;(this.stockfish as Worker).postMessage('stop')
  }
  public quit() {
    ;(this.stockfish as Worker).postMessage('quit')
  }
  public destroy() {
    ;(this.stockfish as Worker).terminate()
    this.stockfish = undefined
  }
}
