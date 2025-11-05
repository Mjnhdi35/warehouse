<script setup lang="ts">
defineOptions({
  name: 'AppCheckbox',
});

interface Props {
  /**
   * Checkbox label
   */
  label?: string;
  /**
   * Checkbox value
   */
  modelValue?: boolean;
  /**
   * Checkbox state: 'normal' | 'hover' | 'checked' | 'disabled'
   */
  state?: 'normal' | 'hover' | 'checked' | 'disabled';
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Checkbox name
   */
  name?: string;
  /**
   * Checkbox id
   */
  id?: string;
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  state: 'normal',
  disabled: false,
  class: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [event: Event];
}>();

const isChecked = computed({
  get: () => props.modelValue ?? props.state === 'checked',
  set: (value: boolean) => {
    emit('update:modelValue', value);
  },
});

const checkboxId = computed(
  () => props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
);

const checkboxClasses = computed(() => {
  const base = [
    'w-5 h-5',
    'rounded border-2',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'cursor-pointer',
  ];

  if (props.disabled || props.state === 'disabled') {
    return [
      ...base,
      'border-gray-300 bg-gray-100',
      'cursor-not-allowed opacity-50',
    ];
  }

  if (isChecked.value || props.state === 'checked') {
    return [...base, 'bg-primary border-primary', 'text-white'];
  }

  if (props.state === 'hover') {
    return [...base, 'border-primary bg-primary-soft'];
  }

  return [...base, 'border-gray-300 bg-white', 'hover:border-primary'];
});
</script>

<template>
  <label
    :for="checkboxId"
    :class="['inline-flex items-center gap-2 cursor-pointer', props.class]"
  >
    <input
      :id="checkboxId"
      :name="name"
      type="checkbox"
      :checked="isChecked"
      :disabled="disabled || state === 'disabled'"
      :class="checkboxClasses"
      @change="
        isChecked = ($event.target as HTMLInputElement).checked;
        emit('change', $event);
      "
    />
    <span v-if="label" class="body-small text-gray-900">
      {{ label }}
    </span>
  </label>
</template>
