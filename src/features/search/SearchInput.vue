<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue?: string
    label: string
    inputAriaLabel: string
    placeholder: string
    clearInputAriaLabel: string
  }>(),
  {
    id: 'search-input',
    modelValue: '',
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
  <div class="relative w-full max-w-none">
    <label class="sr-only" :for="props.id">
      {{ props.label }}
    </label>
    <Search
      class="text-foreground pointer-events-none absolute top-1/2 left-0 h-6 w-6 -translate-y-1/2 sm:h-7 sm:w-7"
      aria-hidden="true"
    />
    <input
      :id="props.id"
      ref="inputRef"
      :value="props.modelValue"
      inputmode="search"
      enterkeyhint="search"
      autocomplete="off"
      :aria-label="props.inputAriaLabel"
      :placeholder="props.placeholder"
      class="placeholder:text-muted/90 text-foreground w-full appearance-none border-0 border-b border-white/25 bg-transparent py-3 pr-11 pl-10 text-xl leading-snug transition-colors outline-none focus-visible:border-white/70 sm:py-4 sm:pl-12 sm:text-2xl"
      type="text"
      @input="handleInput"
    />
    <button
      v-if="props.modelValue"
      type="button"
      class="text-muted hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-0 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
      :aria-label="props.clearInputAriaLabel"
      @click="clearInput"
    >
      <X class="h-6 w-6" aria-hidden="true" />
    </button>
  </div>
</template>
