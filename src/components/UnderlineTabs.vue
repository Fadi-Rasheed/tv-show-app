<script setup lang="ts">
export type TabItem = {
  value: string
  label: string
}

defineProps<{
  tabs: TabItem[]
  tablistAriaLabel: string
}>()

const active = defineModel<string>({ required: true })
</script>

<template>
  <div
    class="border-border flex flex-wrap gap-1 border-b sm:gap-2"
    role="tablist"
    :aria-label="tablistAriaLabel"
  >
    <button
      v-for="tab in tabs"
      :id="`tab-${tab.value}`"
      :key="tab.value"
      class="ring-ring focus-visible:ring-brand/70 relative -mb-px border-b-2 px-3 py-3 text-sm font-semibold transition focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none sm:px-4 sm:text-body-md"
      :class="
        active === tab.value
          ? 'text-foreground border-foreground'
          : 'text-muted hover:text-foreground border-transparent'
      "
      role="tab"
      type="button"
      :aria-selected="active === tab.value"
      :tabindex="active === tab.value ? 0 : -1"
      :aria-controls="`panel-${tab.value}`"
      @click="active = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
