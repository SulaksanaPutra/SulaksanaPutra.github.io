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
  const content = JSON.stringify(props.data);
  
  // Look for existing prerendered script tag to avoid duplicates during hydration
  const existingTags = document.querySelectorAll('script[type="application/ld+json"]');
  for (let i = 0; i < existingTags.length; i++) {
    if (existingTags[i].textContent === content) {
      scriptTag = existingTags[i] as HTMLScriptElement;
      return; // Reuse the prerendered tag
    }
  }

  scriptTag = document.createElement('script');
  scriptTag.type = 'application/ld+json';
  scriptTag.textContent = content;
  document.head.appendChild(scriptTag);
});

onUnmounted(() => {
  if (scriptTag && scriptTag.parentNode) {
    scriptTag.parentNode.removeChild(scriptTag);
  }
});

watch(() => props.data, updateJsonLd, { deep: true });
</script>
