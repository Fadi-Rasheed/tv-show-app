<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    placeholder: string
    id?: string
    modelValue?: string
    label?: string
    ariaLabel?: string
  }>(),
  {
    id: 'search-input',
    modelValue: '',
    label: undefined,
    ariaLabel: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearInput = async () => {
  emit('update:modelValue', '')
  await nextTick()
  inputRef.value?.focus()
}
</script>

<template>
  <div class="w-full max-w-xs">
    <label v-if="props.label" class="text-muted mb-2 block text-sm font-medium" :for="props.id">
      {{ props.label }}
    </label>
    <div class="relative">
      <Search
        class="text-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        :id="props.id"
        ref="inputRef"
        :value="props.modelValue"
        :aria-label="props.ariaLabel ?? props.label ?? props.placeholder"
        :placeholder="props.placeholder"
        :class="[
          'bg-surface border-border text-foreground placeholder:text-muted ring-ring hover:border-brand focus-visible:ring-brand/70 w-full rounded-xl border py-2.5 pr-10 pl-10 text-sm transition focus-visible:ring-2 focus-visible:outline-none',
          props.modelValue ? 'border-brand/50' : '',
        ]"
        type="text"
        @input="handleInput"
      />
      <button
        v-if="props.modelValue"
        type="button"
        class="text-muted hover:text-brand-strong focus-visible:ring-brand/70 absolute top-1/2 right-3.5 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
        :aria-label="`Clear ${props.label ?? 'search'}`"
        @click="clearInput"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
