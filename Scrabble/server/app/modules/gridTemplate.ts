export enum Multiplier {SINGLE, DOUBLE_LETTER, TRIPLE_LETTER, DOUBLE_WORD, TRIPLE_WORD}

export interface Coord
{
    x: number;
    y: number;
}

export const CENTER_TILE = { x: 8, y: 8 };

export const GRID_TEMPLATE: {coord: Coord, mult: Multiplier}[] = [

    {coord: CENTER_TILE, mult: Multiplier.DOUBLE_WORD},

    {coord: {x: 1, y: 1}, mult: Multiplier.TRIPLE_WORD},
    {coord: {x: 8, y: 1}, mult: Multiplier.TRIPLE_WORD},
    {coord: {x: 15, y: 1}, mult: Multiplier.TRIPLE_WORD},
    {coord: {x: 1, y: 8}, mult: Multiplier.TRIPLE_WORD},
    {coord: {x: 15, y: 8}, mult: Multiplier.TRIPLE_WORD},
    {coord: {x: 1, y: 15}, mult: Multiplier.TRIPLE_WORD},
    {coord: {x: 8, y: 15}, mult: Multiplier.TRIPLE_WORD},
    {coord: {x: 15, y: 15}, mult: Multiplier.TRIPLE_WORD},

    {coord: {x: 2, y: 2}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 3, y: 3}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 4, y: 4}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 5, y: 5}, mult: Multiplier.DOUBLE_WORD},

    {coord: {x: 2, y: 14}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 3, y: 13}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 4, y: 12}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 5, y: 11}, mult: Multiplier.DOUBLE_WORD},

    {coord: {x: 14, y: 2}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 13, y: 3}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 12, y: 4}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 11, y: 5}, mult: Multiplier.DOUBLE_WORD},

    {coord: {x: 14, y: 14}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 13, y: 13}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 12, y: 12}, mult: Multiplier.DOUBLE_WORD},
    {coord: {x: 11, y: 11}, mult: Multiplier.DOUBLE_WORD},

    {coord: {x: 6, y: 2}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 10, y: 2}, mult: Multiplier.TRIPLE_LETTER},

    {coord: {x: 2, y: 6}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 6, y: 6}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 10, y: 6}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 14, y: 6}, mult: Multiplier.TRIPLE_LETTER},

    {coord: {x: 2, y: 10}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 6, y: 10}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 10, y: 10}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 14, y: 10}, mult: Multiplier.TRIPLE_LETTER},

    {coord: {x: 6, y: 14}, mult: Multiplier.TRIPLE_LETTER},
    {coord: {x: 10, y: 14}, mult: Multiplier.TRIPLE_LETTER},

    {coord: {x: 1, y: 4}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 1, y: 12}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 3, y: 7}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 3, y: 9}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 4, y: 1}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 4, y: 8}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 4, y: 15}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 7, y: 3}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 7, y: 7}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 7, y: 9}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 7, y: 13}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 8, y: 4}, mult: Multiplier.DOUBLE_LETTER},

    {coord: {x: 8, y: 12}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 9, y: 3}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 9, y: 7}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 9, y: 9}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 9, y: 13}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 12, y: 1}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 12, y: 8}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 12, y: 15}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 13, y: 7}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 13, y: 9}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 15, y: 4}, mult: Multiplier.DOUBLE_LETTER},
    {coord: {x: 15, y: 12}, mult: Multiplier.DOUBLE_LETTER}
];
