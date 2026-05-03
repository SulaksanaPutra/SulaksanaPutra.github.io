export type CellValue = number | null; // null for empty, otherwise a color/block ID

export type Grid = CellValue[][];

export interface BlockCoordinate {
  r: number;
  c: number;
}

export interface ShapeDefinition {
  id: number;
  blocks: BlockCoordinate[];
  color: string;
}

export interface GameState {
  grid: Grid;
  score: number;
  highScore: number;
  isGameOver: boolean;
}

// Minimalist preset shapes
export const SHAPE_TEMPLATES = [
  // 1x1 block
  { blocks: [{ r: 0, c: 0 }], color: 'bg-text-primary' },
  // 2x2 square
  {
    blocks: [
      { r: 0, c: 0 }, { r: 0, c: 1 },
      { r: 1, c: 0 }, { r: 1, c: 1 }
    ],
    color: 'bg-accent-primary'
  },
  // 3x3 square
  {
    blocks: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
      { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }
    ],
    color: 'bg-text-secondary'
  },
  // 1x2 vertical
  { blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }], color: 'bg-[#5c5c5c]' },
  // 1x3 vertical
  { blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }], color: 'bg-[#8c715b]' },
  // 1x4 vertical
  { blocks: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }], color: 'bg-text-primary' },
  // 2x1 horizontal
  { blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }], color: 'bg-accent-primary' },
  // 3x1 horizontal
  { blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }], color: 'bg-text-secondary' },
  // 4x1 horizontal
  { blocks: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }], color: 'bg-[#8c715b]' },
  // L shape 1
  {
    blocks: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
      { r: 2, c: 0 }, { r: 2, c: 1 }
    ],
    color: 'bg-text-primary'
  },
  // L shape 2
  {
    blocks: [
      { r: 0, c: 1 },
      { r: 1, c: 1 },
      { r: 2, c: 0 }, { r: 2, c: 1 }
    ],
    color: 'bg-accent-primary'
  },
  // L shape 3
  {
    blocks: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
      { r: 1, c: 0 }
    ],
    color: 'bg-text-secondary'
  },
  // L shape 4
  {
    blocks: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
      { r: 1, c: 2 }
    ],
    color: 'bg-[#5c5c5c]'
  }
];
