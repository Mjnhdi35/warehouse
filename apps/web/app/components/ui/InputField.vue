<script setup lang="ts">
import type { InputProps } from '@nuxt/ui';

defineOptions({
  name: 'AppInputField',
});

interface Props extends Omit<InputProps, 'color'> {
  /**
   * Input state: 'normal' | 'typing' | 'warning' | 'error' | 'success' | 'filled'
   */
  state?: 'normal' | 'typing' | 'warning' | 'error' | 'success' | 'filled';
  /**
   * Helper text
   */
  helper?: string;
  /**
   * Warning message
   */
  warning?: string;
  /**
   * Success message
   */
  success?: string;
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  state: 'normal',
  disabled: false,
  required: false,
  class: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  input: [event: Event];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const inputId = computed(
  () => props.id || `input-${Math.random().toString(36).substr(2, 9)}`,
);

const inputColor = computed(() => {
  switch (props.state) {
    case 'error':
      return 'red';
    case 'warning':
      return 'amber';
    case 'success':
      return 'green';
    case 'typing':
    case 'filled':
      return 'primary';
    default:
      return undefined;
  }
});

const labelClasses = computed(() => [
  'block mb-2',
  'body-small-medium',
  'text-gray-900',
  props.required && "after:content-['*'] after:ml-1 after:text-danger",
]);

const helperClasses = computed(() => {
  switch (props.state) {
    case 'error':
      return 'text-danger';
    case 'warning':
      return 'text-warning';
    case 'success':
      return 'text-success';
    default:
      return 'text-gray-600';
  }
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const displayMessage = computed(() => {
  if (props.error) return props.error;
  if (props.warning) return props.warning;
  if (props.success) return props.success;
  return props.helper;
});
</script>

<template>
  <UFormGroup
    :label="label"
    :name="name || inputId"
    :error="error"
    :required="required"
    :class="class"
  >
    <UInput
      :id="inputId"
      :name="name"
      :type="type"
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :color="inputColor"
      :class="['body-medium']"
      v-bind="$attrs"
      @update:model-value="emit('update:modelValue', $event)"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <p
      v-if="displayMessage && !error"
      :class="['body-small mt-1', helperClasses]"
    >
      {{ displayMessage }}
    </p>
  </UFormGroup>
</template>
