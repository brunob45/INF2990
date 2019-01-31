import { SudokuQueue } from './sudokuQueue.js';
import { ResponseQueue } from './responseQueue';

export module Queues{
    export let easySudokuQueue: SudokuQueue;
    export let hardSudokuQueue: SudokuQueue;
    export let easyResponseQueue: ResponseQueue;
    export let hardResponseQueue: ResponseQueue;
}
