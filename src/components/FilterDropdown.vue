<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DropdownSelect from '@/components/DropdownSelect.vue'

type FilterOption = {
  value: string
  labelKey: string
}

const props = withDefaults(
  defineProps<{
    id?: string
    labelKey?: string
    options: FilterOption[]
    modelValue?: string
    onSelect?: (value: string) => void
  }>(),
  {
    id: 'filter-dropdown',
    labelKey: 'common.components.filterDropdown.label',
    modelValue: '',
    onSelect: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

const translatedOptions = computed(() =>
  props.options.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  })),
)

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  props.onSelect?.(value)
}
</script>

<template>
  <DropdownSelect
    :id="id"
    :aria-label="t('common.components.filterDropdown.openAriaLabel')"
    :list-aria-label="t('common.components.filterDropdown.listAriaLabel')"
    :model-value="modelValue"
    :options="translatedOptions"
    :placeholder="t(labelKey)"
    @update:model-value="handleSelect"
  />
</template>
