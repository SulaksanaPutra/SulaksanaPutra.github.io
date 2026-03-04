<template>
    <div class="section-container relative">
        <div class="section-wrapper">
            <div class="content-narrow py-8 text-center">
                <h1 class="text-6xl font-bold">500</h1>
                <p class="text-2xl mt-4">Internal Server Error</p>
                <p class="mt-2">Something went wrong on our end. Please try again later.</p>
                <router-link to="/" class="text-sm text-primary hover:underline">
                    Go Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.section-wrapper {
    min-height: 100dvh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
