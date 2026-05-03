<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    enabled?: boolean
  }>(),
  {
    enabled: true,
  },
)

const emit = defineEmits<{
  leave: []
}>()

const rootRef = ref<HTMLElement | null>(null)

const isOutsideRoot = (target: EventTarget | null): boolean =>
  !(target instanceof Node) || !rootRef.value?.contains(target)

const onPointerDown = (event: PointerEvent) => {
  if (!props.enabled || !isOutsideRoot(event.target)) {
    return
  }

  emit('leave')
}

const onFocusIn = (event: FocusEvent) => {
  if (!props.enabled || !isOutsideRoot(event.target)) {
    return
  }

  emit('leave')
}

onMounted(() => {
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('focusin', onFocusIn)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('focusin', onFocusIn)
})
</script>

<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>
