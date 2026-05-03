import { onMounted, ref, watch } from 'vue';
import { Grid, SHAPE_TEMPLATES, ShapeDefinition } from '../types';

export function useGridMatch() {
    const ROWS = 8;
    const COLS = 8;
    const SCORE_PER_BLOCK = 10;
    const SCORE_PER_LINE = 100;

    const grid = ref<Grid>(createEmptyGrid());
    const availableShapes = ref<(ShapeDefinition | null)[]>([null, null, null]);
    const score = ref(0);
    const highScore = ref(0);
    const isGameOver = ref(false);

    function createEmptyGrid(): Grid {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    }

    function loadHighScore() {
        const saved = localStorage.getItem('gridMatchHighScore');
        if (saved) {
            highScore.value = parseInt(saved, 10);
        }
    }

    function saveHighScore() {
        localStorage.setItem('gridMatchHighScore', highScore.value.toString());
    }

    watch(score, (newScore) => {
        if (newScore > highScore.value) {
            highScore.value = newScore;
            saveHighScore();
        }
    });

    function getRandomShape(): ShapeDefinition {
        const template = SHAPE_TEMPLATES[Math.floor(Math.random() * SHAPE_TEMPLATES.length)];
        // Generate a unique id for the shape instance
        return { ...template, id: Date.now() + Math.random() };
    }

    function generateShapes() {
        availableShapes.value = [getRandomShape(), getRandomShape(), getRandomShape()];
    }

    function initializeGame() {
        grid.value = createEmptyGrid();
        score.value = 0;
        isGameOver.value = false;
        loadHighScore();
        generateShapes();
    }

    // Check if a shape can be placed at the target grid coordinates
    function canPlaceShape(shape: ShapeDefinition, targetRow: number, targetCol: number): boolean {
        for (const block of shape.blocks) {
            const r = targetRow + block.r;
            const c = targetCol + block.c;

            // Check bounds
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) {
                return false;
            }
            // Check if cell is empty
            if (grid.value[r][c] !== null) {
                return false;
            }
        }
        return true;
    }

    function placeShape(shapeIndex: number, targetRow: number, targetCol: number): boolean {
        const shape = availableShapes.value[shapeIndex];
        if (!shape) return false;

        if (!canPlaceShape(shape, targetRow, targetCol)) {
            return false;
        }

        // Place the shape
        const newGrid = [...grid.value.map((row) => [...row])];
        for (const block of shape.blocks) {
            const r = targetRow + block.r;
            const c = targetCol + block.c;
            newGrid[r][c] = shapeIndex + 1; // Temporarily using shape index + 1 as color identifier or just store shape.color
        }

        // Store actual color string in grid
        for (const block of shape.blocks) {
            const r = targetRow + block.r;
            const c = targetCol + block.c;
            newGrid[r][c] = shape.color as any;
        }

        grid.value = newGrid;

        // Add points for placing blocks
        score.value += shape.blocks.length * SCORE_PER_BLOCK;

        // Remove the placed shape
        availableShapes.value[shapeIndex] = null;

        // Check for lines to clear
        checkAndClearLines();

        // Replenish shapes if all are used
        if (availableShapes.value.every((s) => s === null)) {
            generateShapes();
        }

        // Check if the game is over
        checkGameOver();

        return true;
    }

    function checkAndClearLines() {
        let rowsToClear: number[] = [];
        let colsToClear: number[] = [];

        // Check rows
        for (let r = 0; r < ROWS; r++) {
            let isFull = true;
            for (let c = 0; c < COLS; c++) {
                if (grid.value[r][c] === null) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) rowsToClear.push(r);
        }

        // Check columns
        for (let c = 0; c < COLS; c++) {
            let isFull = true;
            for (let r = 0; r < ROWS; r++) {
                if (grid.value[r][c] === null) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) colsToClear.push(c);
        }

        const linesCleared = rowsToClear.length + colsToClear.length;
        if (linesCleared === 0) return;

        // Combo multiplier logic (1 line = 1x, 2 lines = 2x, etc.)

        score.value += linesCleared * SCORE_PER_LINE * linesCleared;

        // Clear the lines
        const newGrid = [...grid.value.map((row) => [...row])];

        rowsToClear.forEach((r) => {
            for (let c = 0; c < COLS; c++) {
                newGrid[r][c] = null;
            }
        });

        colsToClear.forEach((c) => {
            for (let r = 0; r < ROWS; r++) {
                newGrid[r][c] = null;
            }
        });

        grid.value = newGrid;
    }

    function checkGameOver() {
        // If there's at least one shape that can be placed somewhere, game is not over
        for (const shape of availableShapes.value) {
            if (!shape) continue;

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (canPlaceShape(shape, r, c)) {
                        return; // Found a valid move
                    }
                }
            }
        }

        // No shapes can be placed
        isGameOver.value = true;
    }

    onMounted(() => {
        initializeGame();
    });

    return {
        grid,
        availableShapes,
        score,
        highScore,
        isGameOver,
        initializeGame,
        placeShape,
    };
}
