<script setup lang="ts">
defineOptions({
  name: 'AppRadio',
});

interface Props {
  /**
   * Radio label
   */
  label?: string;
  /**
   * Radio value
   */
  value: string | number;
  /**
   * Selected value
   */
  modelValue?: string | number;
  /**
   * Radio state: 'normal' | 'hover' | 'checked'
   */
  state?: 'normal' | 'hover' | 'checked';
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Radio name
   */
  name?: string;
  /**
   * Radio id
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
  'update:modelValue': [value: string | number];
  'change': [event: Event];
}>();

const isChecked = computed({
  get: () => props.modelValue === props.value || props.state === 'checked',
  set: (value: boolean) => {
    if (value) {
      emit('update:modelValue', props.value);
    }
  },
});

const radioId = computed(() => props.id || `radio-${Math.random().toString(36).substr(2, 9)}`);

const radioClasses = computed(() => {
  const base = [
    'w-5 h-5',
    'rounded-full border-2',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'cursor-pointer',
  ];

  if (props.disabled) {
    return [
      ...base,
      'border-gray-300 bg-gray-100',
      'cursor-not-allowed opacity-50',
    ];
  }

  if (isChecked.value || props.state === 'checked') {
    return [
      ...base,
      'border-primary',
      'bg-white',
      'after:content-[""] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-primary after:mx-auto after:mt-0.5',
    ];
  }

  if (props.state === 'hover') {
    return [
      ...base,
      'border-primary bg-primary-soft',
    ];
  }

  return [
    ...base,
    'border-gray-300 bg-white',
    'hover:border-primary',
  ];
});
</script>

<template>
  <label
    :for="radioId"
    :class="['inline-flex items-center gap-2 cursor-pointer', props.class]"
  >
    <input
      :id="radioId"
      :name="name"
      type="radio"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :class="radioClasses"
      @change="isChecked = true; emit('change', $event)"
    >
    <span
      v-if="label"
      class="body-small text-gray-900"
    >
      {{ label }}
    </span>
  </label>
</template>

