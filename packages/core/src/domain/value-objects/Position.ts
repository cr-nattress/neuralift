/**
 * Position Value Object
 *
 * Represents a position in the 3x3 training grid.
 * Provides utilities for position manipulation and comparison.
 */

import { GRID_SIZE, TOTAL_POSITIONS } from '../../config/constants';

/**
 * Position index type (0-8 for 3x3 grid)
 */
export type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Position with row and column coordinates
 */
export interface Position {
  readonly row: number;
  readonly col: number;
  readonly index: PositionIndex;
}

/**
 * Validates if a number is a valid position index
 */
export function isValidPositionIndex(value: number): value is PositionIndex {
  return Number.isInteger(value) && value >= 0 && value < TOTAL_POSITIONS;
}

/**
 * Creates a Position from an index (0-8)
 */
export function createPosition(index: number): Position {
  if (!isValidPositionIndex(index)) {
    throw new Error(`Invalid position index: ${index}. Must be between 0 and ${TOTAL_POSITIONS - 1}.`);
  }

  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
    index,
  };
}

/**
 * Creates a Position from row and column coordinates
 */
export function createPositionFromCoords(row: number, col: number): Position {
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    throw new Error(`Invalid position coordinates: (${row}, ${col})`);
  }

  const index = (row * GRID_SIZE + col) as PositionIndex;
  return { row, col, index };
}

/**
 * Checks if two positions are equal
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.index === b.index;
}

/**
 * Gets all valid position indices
 */
export function getAllPositionIndices(): readonly PositionIndex[] {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
}

/**
 * Gets a random position index
 */
export function getRandomPositionIndex(): PositionIndex {
  return Math.floor(Math.random() * TOTAL_POSITIONS) as PositionIndex;
}
