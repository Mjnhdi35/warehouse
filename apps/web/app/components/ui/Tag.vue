<script setup lang="ts">
defineOptions({
  name: 'AppTag',
});

interface Props {
  /**
   * Tag text
   */
  label: string;
  /**
   * Tag variant: 'default' | 'new' | 'best-sale' | 'out-of-stock'
   */
  variant?: 'default' | 'new' | 'best-sale' | 'out-of-stock';
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  class: undefined,
});

const tagClasses = computed(() => {
  const base = [
    'inline-flex items-center justify-center',
    'px-3 py-1.5 rounded',
    'body-small-semibold',
    'transition-colors duration-200',
  ];

  switch (props.variant) {
    case 'new':
      return [
        ...base,
        'bg-primary text-white',
      ];
    case 'best-sale':
      return [
        ...base,
        'bg-danger text-white',
      ];
    case 'out-of-stock':
      return [
        ...base,
        'bg-gray-200 text-gray-700',
      ];
    default:
      return [
        ...base,
        'bg-primary-soft text-primary-hard',
      ];
  }
});
</script>

<template>
  <span :class="tagClasses">
    {{ label }}
  </span>
</template>

