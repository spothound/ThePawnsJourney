interface lichessPlayer {
  name: string;
  color: string;
  rating: number;
}

interface LichessGame {
  id: string;
  perf: {
    key: string;
    name: string;
  };
  rated: boolean;
  players: lichessPlayer[];
  pgn: string;
  clock: string;
}

interface LichessPuzzle {
  id: string;
  rating: number;
  plays: number;
  solution: string[];
  themes: string[];
  initialPly: number;
}

interface LichessPuzzleData {
  game: LichessGame;
  puzzle: LichessPuzzle;
}

function isLichessPuzzleData(data: any): data is LichessPuzzleData {
  return (
    data.game !== undefined &&
    data.puzzle !== undefined &&
    data.game.id !== undefined &&
    data.puzzle.id !== undefined &&
    data.puzzle.rating !== undefined &&
    data.puzzle.plays !== undefined &&
    data.puzzle.solution !== undefined &&
    data.puzzle.themes !== undefined &&
    data.puzzle.initialPly !== undefined
  );
}

function readLichessPuzzleData(data: any): LichessPuzzleData {
  if (isLichessPuzzleData(data)) {
    const puzzleData: LichessPuzzleData = {
      game: data.game,
      puzzle: data.puzzle,
    };
    return puzzleData;
  } else {
    throw new Error("Invalid LichessPuzzleData");
  }
}

export type { LichessPuzzleData, LichessPuzzle, LichessGame, lichessPlayer };
export { readLichessPuzzleData };
