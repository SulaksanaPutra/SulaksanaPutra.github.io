<template>
  <aside class="flex flex-col bg-bg-main border-r border-border-subtle p-6">
    <nav>
      <ul class="flex flex-col gap-y-4">
        <li>
          <router-link to="/" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Home</router-link>
        </li>
        <li>
          <router-link to="/systems" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Systems</router-link>
        </li>
        <li>
          <router-link to="/case-studies" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Case Studies</router-link>
        </li>
        <li>
          <router-link to="/skills" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Skills</router-link>
        </li>
        <li>
          <router-link to="/now" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Now</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
</script>
