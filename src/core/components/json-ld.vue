<template>
  <!-- JSON-LD is injected into a script tag -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  data: Record<string, any>;
}>();

let scriptTag: HTMLScriptElement | null = null;

const updateJsonLd = () => {
  if (scriptTag) {
    scriptTag.textContent = JSON.stringify(props.data);
  }
};

onMounted(() => {
  scriptTag = document.createElement('script');
  scriptTag.type = 'application/ld+json';
  scriptTag.textContent = JSON.stringify(props.data);
  document.head.appendChild(scriptTag);
});

onUnmounted(() => {
  if (scriptTag && scriptTag.parentNode) {
    scriptTag.parentNode.removeChild(scriptTag);
  }
});

watch(() => props.data, updateJsonLd, { deep: true });
</script>
