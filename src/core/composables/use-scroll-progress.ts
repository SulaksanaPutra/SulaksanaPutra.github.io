import { onMounted, onUnmounted } from 'vue';
import { scrollProgress } from '@/store';

export function useScrollProgress() {
    const updateScrollProgress = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (height > 0) {
            scrollProgress.value = (winScroll / height) * 100;
        } else {
            scrollProgress.value = 0;
        }
    };

    onMounted(() => {
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', updateScrollProgress);
    });

    return {
        scrollProgress,
    };
}
