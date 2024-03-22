import type { Color} from 'chessground/types';
export function shortToLongColor(color: 'w' | 'b'): Color {
  return color === 'w' ? 'white' : 'black'
}
