<template>
    <div class="image-container" :class="{ 'is-loading': !isLoaded }">
        <div v-if="!isLoaded && showSkeleton" class="skeleton-block absolute inset-0 !m-0" />
        <img
            :src="currentSrc"
            v-bind="$attrs"
            loading="lazy"
            decoding="async"
            @load="onLoad"
            class="transition-opacity duration-700 ease-in-out"
            :class="isLoaded ? 'opacity-100' : 'opacity-0'"
            alt="thumbnail"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isDark } from '@/store';

interface ThemeImageProps {
    src: string | { light: string; dark: string };
    showSkeleton?: boolean;
}

const props = withDefaults(defineProps<ThemeImageProps>(), {
    showSkeleton: true,
});

const isLoaded = ref(false);

const currentSrc = computed(() => {
    if (typeof props.src === 'string') {
        return props.src;
    }
    return isDark.value ? props.src.dark : props.src.light;
});

// Reset loaded state when source changes
watch(currentSrc, () => {
    isLoaded.value = false;
});

const onLoad = () => {
    isLoaded.value = true;
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
