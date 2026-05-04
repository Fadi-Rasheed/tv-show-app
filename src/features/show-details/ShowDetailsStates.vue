<script setup lang="ts">
import { computed, type Component } from 'vue'
import ShowDetailsErrorState from '@/features/show-details/ShowDetailsErrorState.vue'
import ShowDetailsInvalidState from '@/features/show-details/ShowDetailsInvalidState.vue'
import ShowDetailsLoadingState from '@/features/show-details/ShowDetailsLoadingState.vue'

export type ShowDetailsViewState = 'invalid' | 'loading' | 'error'

const props = defineProps<{
  state: ShowDetailsViewState
}>()

const stateComponentMap: Record<ShowDetailsViewState, Component> = {
  invalid: ShowDetailsInvalidState,
  loading: ShowDetailsLoadingState,
  error: ShowDetailsErrorState,
}

const activeStateComponent = computed(() => stateComponentMap[props.state])
</script>

<template>
  <component :is="activeStateComponent" />
</template>
