<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronDown } from 'lucide-vue-next'
import FocusBoundary from '@/components/FocusBoundary.vue'

type DropdownOption = {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    id?: string
    options: DropdownOption[]
    modelValue?: string
    placeholder?: string
    ariaLabel?: string
    listAriaLabel?: string
  }>(),
  {
    id: 'dropdown-select',
    modelValue: '',
    placeholder: 'Select an option',
    ariaLabel: 'Open dropdown options',
    listAriaLabel: 'Dropdown options',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const activeIndex = ref(-1)
const selectedIndex = computed(() =>
  props.options.findIndex((option) => option.value === props.modelValue)
)
const selectedOption = computed(() => props.options[selectedIndex.value])
const listboxId = computed(() => `${props.id}-listbox`)

const closeDropdown = () => {
  isOpen.value = false
  activeIndex.value = -1
}

const openDropdown = () => {
  isOpen.value = true
  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0
}

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown()
    return
  }

  openDropdown()
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
  closeDropdown()
}

const focusNextOption = () => {
  if (!props.options.length) {
    return
  }

  if (!isOpen.value) {
    openDropdown()
    return
  }

  activeIndex.value = (activeIndex.value + 1 + props.options.length) % props.options.length
}

const focusPreviousOption = () => {
  if (!props.options.length) {
    return
  }

  if (!isOpen.value) {
    openDropdown()
    return
  }

  activeIndex.value = (activeIndex.value - 1 + props.options.length) % props.options.length
}

const onButtonKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusNextOption()
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusPreviousOption()
  }
}

const onListboxKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusNextOption()
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusPreviousOption()
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const option = props.options[activeIndex.value]
    if (option) {
      selectOption(option.value)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeDropdown()
  }
}
</script>

<template>
  <FocusBoundary class="relative w-full max-w-xs" :enabled="isOpen" @leave="closeDropdown">
    <button
      :aria-controls="listboxId"
      :aria-expanded="isOpen"
      :aria-label="ariaLabel"
      class="bg-surface border-border text-foreground ring-ring hover:border-brand focus-visible:ring-brand/70 flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2 text-left text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
      type="button"
      @click="toggleDropdown"
      @keydown="onButtonKeydown"
    >
      <span class="truncate">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <ChevronDown
        aria-hidden="true"
        class="text-brand-strong h-4 w-4 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <ul
      v-if="isOpen"
      :id="listboxId"
      :aria-label="listAriaLabel"
      class="bg-surface border-border ring-ring/60 absolute z-30 m-0 mt-2 max-h-64 w-full list-none overflow-auto rounded-xl border p-0 py-1 shadow-[0_14px_30px_rgba(0,0,0,0.38)] focus-visible:ring-2"
      role="listbox"
      tabindex="0"
      @keydown="onListboxKeydown"
    >
      <li v-for="(option, index) in options" :key="option.value" role="presentation">
        <button
          :aria-selected="modelValue === option.value"
          class="hover:bg-brand/15 focus-visible:bg-brand/15 focus-visible:ring-brand/60 text-foreground flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition focus-visible:ring-2 focus-visible:outline-none"
          :class="{
            'bg-brand/20': activeIndex === index,
            'text-brand-strong': modelValue === option.value,
          }"
          role="option"
          type="button"
          @click="selectOption(option.value)"
          @mouseenter="activeIndex = index"
        >
          <span class="truncate">
            {{ option.label }}
          </span>
          <Check
            v-if="modelValue === option.value"
            aria-hidden="true"
            class="text-brand h-4 w-4 shrink-0"
          />
        </button>
      </li>
    </ul>
  </FocusBoundary>
</template>
