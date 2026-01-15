import { ref } from 'vue';

// --- State ---
export const isDark = ref(false);
export const language = ref('EN');
export const isDrawerOpen = ref(false);
export const scrollProgress = ref(0);
export const activeSection = ref('');
export const headerComponentRef = ref<{ headerRef: HTMLElement | null } | null>(null);
export const drawerTop = ref('0px');
