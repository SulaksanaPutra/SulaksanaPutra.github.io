<template>
    <div
        class="flex flex-col items-center justify-start min-h-[100dvh] bg-bg-main text-text-primary font-sans touch-none select-none overflow-hidden relative pt-12 sm:pt-20"
    >
        <!-- Game Area -->
        <div class="w-full max-w-md px-6 flex flex-col relative">
            <!-- Grid -->
            <div
                ref="gridRef"
                class="bg-bg-muted p-3 sm:p-4 rounded-xl grid grid-cols-8 gap-1.5 shadow-sm border border-border-subtle relative"
            >
                <template v-for="(row, r) in grid" :key="'row-' + r">
                    <div
                        v-for="(cell, c) in row"
                        :key="'cell-' + r + '-' + c"
                        class="aspect-square rounded-sm transition-colors duration-200"
                        :class="[
                            cell ? cell : 'bg-bg-main border border-border-subtle/50',
                            isPreview(r, c) ? 'opacity-40 ring-1 ring-text-primary scale-95' : '',
                        ]"
                    ></div>
                </template>

                <!-- Game Over Overlay -->
                <div
                    v-if="isGameOver"
                    class="absolute inset-0 bg-white/90 dark:bg-black/90 rounded-xl flex flex-col items-center justify-center z-10 border border-border-subtle"
                >
                    <h2 class="text-2xl font-bold text-text-primary mb-2">Game Over</h2>
                    <p class="text-lg text-text-secondary mb-8">
                        Final Score: <span class="font-bold text-text-primary">{{ score }}</span>
                    </p>
                    <button @click="initializeGame" class="btn-primary shadow-sm hover:shadow-md">
                        Play Again
                    </button>
                </div>
            </div>

            <!-- Score Area -->
            <div class="mt-8 flex justify-center items-center text-text-secondary text-xs sm:text-sm font-medium uppercase tracking-widest">
                score : <span class="text-text-primary font-bold ml-1 mr-2">{{ score }}</span> / high score : <span class="text-text-primary font-bold ml-1">{{ highScore }}</span>
            </div>

            <!-- Shapes Tray -->
            <div class="mt-8 grid grid-cols-3 gap-6 h-32 relative">
                <div
                    v-for="(shape, index) in availableShapes"
                    :key="index"
                    class="flex items-center justify-center relative"
                >
                    <div
                        v-if="shape"
                        class="relative cursor-grab active:cursor-grabbing transition-transform"
                        :class="{ 'opacity-0': draggedShapeIndex === index }"
                        @pointerdown="(e) => onPointerDown(e, index)"
                    >
                        <!-- Render small shape -->
                        <div
                            class="grid gap-1"
                            :style="{
                                gridTemplateRows: `repeat(${getShapeDimensions(shape).rows}, minmax(0, 1fr))`,
                                gridTemplateColumns: `repeat(${getShapeDimensions(shape).cols}, minmax(0, 1fr))`,
                            }"
                        >
                            <div
                                v-for="block in getNormalizedBlocks(shape)"
                                :key="block.r + '-' + block.c"
                                class="w-[22px] h-[22px] sm:w-6 sm:h-6 rounded-[2px]"
                                :class="shape.color"
                                :style="{ gridRow: block.r + 1, gridColumn: block.c + 1 }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dragged Shape Layer -->
        <div
            v-if="draggedShape"
            class="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 scale-110 transition-none"
            :style="{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }"
        >
            <div
                class="grid gap-1.5"
                :style="{
                    gridTemplateRows: `repeat(${getShapeDimensions(draggedShape).rows}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${getShapeDimensions(draggedShape).cols}, minmax(0, 1fr))`,
                }"
            >
                <div
                    v-for="block in getNormalizedBlocks(draggedShape)"
                    :key="'drag-' + block.r + '-' + block.c"
                    class="rounded-sm opacity-90 shadow-md"
                    :class="draggedShape.color"
                    :style="{
                        gridRow: block.r + 1,
                        gridColumn: block.c + 1,
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                    }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useGridMatch } from '../composables/use-grid-match.ts';
import type { ShapeDefinition } from '../types';

const { grid, availableShapes, score, highScore, isGameOver, initializeGame, placeShape } =
    useGridMatch();

const gridRef = ref<HTMLElement | null>(null);

// Drag State
const draggedShapeIndex = ref<number | null>(null);
const draggedShape = computed(() =>
    draggedShapeIndex.value !== null ? availableShapes.value[draggedShapeIndex.value] : null,
);
const dragPos = ref({ x: 0, y: 0 });
const pointerOffset = ref({ x: 0, y: 0 });

// Hover State for preview
const previewTarget = ref<{ r: number; c: number } | null>(null);

const cachedGridRect = ref<DOMRect | null>(null);
const cellSize = ref(32); // Approximate size, updated on mount

function updateCellSize() {
    if (gridRef.value) {
        // calculate cell width based on grid container
        const width = gridRef.value.clientWidth;
        // Padded container: e.g., p-3 (12px) or p-4 (16px) -> roughly 24px-32px total padding. Let's say padding is 28px avg.
        // 8 columns + 7 gaps of 1.5 (6px) = 42px total gap space.
        // So 8 * cellSize = width - padding - gap space
        cellSize.value = (width - 32 - 42) / 8;
    }
}

onMounted(() => {
    window.addEventListener('resize', updateCellSize);
    // initial delay to let DOM render
    setTimeout(updateCellSize, 100);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateCellSize);
});

function getShapeDimensions(shape: ShapeDefinition) {
    let maxR = 0,
        maxC = 0;
    for (const b of shape.blocks) {
        if (b.r > maxR) maxR = b.r;
        if (b.c > maxC) maxC = b.c;
    }
    return { rows: maxR + 1, cols: maxC + 1 };
}

// Normalize blocks so they start from 0,0 in their grid container
function getNormalizedBlocks(shape: ShapeDefinition) {
    let minR = 99,
        minC = 99;
    for (const b of shape.blocks) {
        if (b.r < minR) minR = b.r;
        if (b.c < minC) minC = b.c;
    }
    return shape.blocks.map((b) => ({ r: b.r - minR, c: b.c - minC }));
}

function onPointerDown(e: PointerEvent, index: number) {
    if (isGameOver.value) return;
    e.preventDefault();

    draggedShapeIndex.value = index;
    dragPos.value = { x: e.clientX, y: e.clientY };

    if (gridRef.value) {
        cachedGridRect.value = gridRef.value.getBoundingClientRect();
    }

    // Offset to center the shape under finger slightly higher so it's visible
    pointerOffset.value = { x: 0, y: -50 };
    dragPos.value.y += pointerOffset.value.y;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(e: PointerEvent) {
    if (draggedShapeIndex.value === null) return;

    dragPos.value = {
        x: e.clientX + pointerOffset.value.x,
        y: e.clientY + pointerOffset.value.y,
    };

    calculatePreview();
}

function calculatePreview() {
    if (!gridRef.value || draggedShapeIndex.value === null || !draggedShape.value) {
        previewTarget.value = null;
        return;
    }

    const rect = cachedGridRect.value || gridRef.value.getBoundingClientRect();
    const shape = draggedShape.value;

    // Approx cell size + gap (6px)
    const step = cellSize.value + 6;

    const dims = getShapeDimensions(shape);
    const shapeWidth = dims.cols * step - 6;
    const shapeHeight = dims.rows * step - 6;

    const shapeLeft = dragPos.value.x - shapeWidth / 2;
    const shapeTop = dragPos.value.y - shapeHeight / 2;

    const gridX = shapeLeft - rect.left - 16; // avg 16px padding
    const gridY = shapeTop - rect.top - 16;

    const c = Math.round(gridX / step);
    const r = Math.round(gridY / step);

    if (r >= -2 && r < 10 && c >= -2 && c < 10) {
        let isValid = true;
        for (const block of shape.blocks) {
            const br = r + block.r;
            const bc = c + block.c;
            if (br < 0 || br >= 8 || bc < 0 || bc >= 8 || grid.value[br][bc] !== null) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            previewTarget.value = { r, c };
        } else {
            previewTarget.value = null;
        }
    } else {
        previewTarget.value = null;
    }
}

function onPointerUp(_e: PointerEvent) {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    if (draggedShapeIndex.value !== null && previewTarget.value !== null) {
        // Attempt placement
        placeShape(draggedShapeIndex.value, previewTarget.value.r, previewTarget.value.c);
    }

    // Reset
    draggedShapeIndex.value = null;
    previewTarget.value = null;
    cachedGridRect.value = null;
}

function isPreview(r: number, c: number) {
    if (!previewTarget.value || !draggedShape.value) return false;

    for (const block of draggedShape.value.blocks) {
        if (previewTarget.value.r + block.r === r && previewTarget.value.c + block.c === c) {
            return true;
        }
    }
    return false;
}
</script>

<style scoped>
body {
    overscroll-behavior-y: contain;
}
</style>
