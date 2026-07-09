<template>
    <div class="group relative inline-block w-full">
        <!-- View Mode -->
        <div v-if="!isEditing" class="relative">
            <slot />

            <div
                class="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 mt-2 h-0 overflow-visible z-[5] w-full justify-end"
            >
                <button
                    @click="startEdit"
                    class="flex items-center justify-center p-1.5 bg-bg-main border border-border-subtle text-text-secondary rounded hover:bg-bg-muted hover:text-accent-primary focus:outline-none transition-colors"
                    title="Edit text"
                >
                    <Edit2 class="w-3 h-3" />
                </button>
                <slot name="actions" />
            </div>
        </div>

        <!-- Edit Mode -->
        <div
            v-else
            class="w-full relative z-20 bg-bg-main p-2 rounded-lg border border-border-subtle mt-1 mb-1"
        >
            <textarea
                v-model="localValue"
                class="w-full bg-bg-main border border-border-subtle rounded px-3 py-2 text-text-primary focus:border-accent-primary focus:ring-0 outline-none transition-all resize-none overflow-hidden"
                :class="[
                    customClass || (multiline ? 'text-lg leading-relaxed' : 'text-base font-bold'),
                ]"
                ref="inputRef"
            ></textarea>
            <div class="flex justify-end gap-2 mt-2">
                <button
                    @click="cancelEdit"
                    class="px-3 py-1 text-xs font-medium text-text-secondary hover:bg-bg-muted rounded transition-colors"
                    :disabled="localIsSaving"
                >
                    Cancel
                </button>
                <button
                    @click="saveEdit"
                    class="bg-accent-primary hover:opacity-90 text-white rounded px-4 py-1 text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center min-w-[4rem]"
                    :disabled="localIsSaving"
                >
                    <span
                        v-if="localIsSaving"
                        class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"
                    ></span>
                    <span v-else>Save</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Edit2 } from 'lucide-vue-next';

const props = defineProps<{
    modelValue: string;
    multiline?: boolean;
    isSaving?: boolean;
    customClass?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'save'): void;
}>();

const isEditing = ref(false);
const localValue = ref(props.modelValue);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const localIsSaving = ref(false);

const adjustHeight = () => {
    const el = inputRef.value;
    if (el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }
};

watch(
    () => localValue.value,
    () => {
        if (isEditing.value) {
            nextTick(adjustHeight);
        }
    },
);

watch(
    () => props.modelValue,
    (newVal) => {
        if (!isEditing.value) {
            localValue.value = newVal;
        }
    },
);

watch(
    () => props.isSaving,
    (newVal) => {
        localIsSaving.value = !!newVal;
        if (!newVal && isEditing.value) {
            isEditing.value = false;
        }
    },
);

const startEdit = async () => {
    localValue.value = props.modelValue;
    isEditing.value = true;
    await nextTick();
    adjustHeight();
    inputRef.value?.focus();
};

const cancelEdit = () => {
    localValue.value = props.modelValue;
    isEditing.value = false;
};

const saveEdit = () => {
    emit('update:modelValue', localValue.value);

    if (props.isSaving === undefined) {
        isEditing.value = false;
    }
    emit('save');
};
</script>
