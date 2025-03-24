export type BoardType = number[][];

export interface SolutionCoordinate {
    row: number;
    col: number;
}

export interface BoardData {
    gridSize: number;
    puzzleId: number;
    board: BoardType;
    solution: SolutionCoordinate[];
}

export type SolutionType = boolean[][];
