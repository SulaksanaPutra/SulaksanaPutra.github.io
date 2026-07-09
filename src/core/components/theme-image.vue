<template>
    <div class="image-container" :class="{ 'is-loading': !isLoaded }" :style="containerStyle">
        <div v-if="!isLoaded && showSkeleton" class="skeleton-block absolute inset-0 !m-0" />
        <img
            :src="currentSrc"
            :alt="alt"
            v-bind="$attrs"
            loading="lazy"
            decoding="async"
            @load="onLoad"
            class="transition-opacity duration-700 ease-in-out"
            :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isDark } from '@/store';

interface ThemeImageProps {
    src: string | { light: string; dark: string };
    alt: string;
    showSkeleton?: boolean;
    dynamicAspect?: boolean;
    aspectRatio?: string | number;
    height?: string;
    width?: string;
}

const props = withDefaults(defineProps<ThemeImageProps>(), {
    showSkeleton: true,
    dynamicAspect: false,
});

const isLoaded = ref(false);
const aspectVal = ref<number | null>(null);

const currentSrc = computed(() => {
    if (typeof props.src === 'string') {
        return props.src;
    }
    return isDark.value ? props.src.dark : props.src.light;
});

const containerStyle = computed(() => {
    const style: Record<string, string> = {};
    if (props.width) {
        style.width = props.width;
    }
    if (props.height) {
        style.height = props.height;
    }
    if (props.aspectRatio) {
        style.aspectRatio = String(props.aspectRatio);
        if (!props.height) {
            style.height = 'auto';
        }
    } else if (props.dynamicAspect) {
        style.aspectRatio = String(aspectVal.value || 1.7778);
        style.height = 'auto';
    }
    return style;
});

// Reset loaded state when source changes
watch(currentSrc, () => {
    isLoaded.value = false;
    aspectVal.value = null;
});

const onLoad = (event: Event) => {
    isLoaded.value = true;
    if (props.dynamicAspect) {
        const img = event.target as HTMLImageElement;
        if (img && img.naturalWidth && img.naturalHeight) {
            aspectVal.value = img.naturalWidth / img.naturalHeight;
        }
    }
};
</script>

<style scoped>
.image-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.is-loading {
    background: var(--bg-muted);
}
</style>
