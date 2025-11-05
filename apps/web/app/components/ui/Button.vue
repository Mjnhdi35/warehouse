<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

defineOptions({
  name: 'AppButton',
});

interface Props extends Omit<ButtonProps, 'color' | 'variant' | 'size'> {
  /**
   * Button variant: 'fill' | 'border' | 'ghost'
   */
  variant?: 'fill' | 'border' | 'ghost';
  /**
   * Button size: 'small' | 'medium' | 'large'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button status: 'default' | 'active' (for hover/active states)
   */
  status?: 'default' | 'active';
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'fill',
  size: 'medium',
  status: 'default',
  class: undefined,
});

const nuxtUIVariant = computed(() => {
  switch (props.variant) {
    case 'fill':
      return 'solid';
    case 'border':
      return 'outline';
    case 'ghost':
      return 'ghost';
    default:
      return 'solid';
  }
});

const nuxtUISize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'sm';
    case 'medium':
      return 'md';
    case 'large':
      return 'lg';
    default:
      return 'md';
  }
});

const buttonClasses = computed(() => {
  const classes: string[] = [];

  if (props.status === 'active') {
    switch (props.variant) {
      case 'fill':
        classes.push('!bg-primary-hard');
        break;
      case 'border':
        classes.push('!bg-primary !border-primary');
        break;
      case 'ghost':
        classes.push('!bg-primary-soft !text-primary-hard');
        break;
    }
  }

  if (props.class) {
    classes.push(props.class);
  }

  return classes.join(' ');
});
</script>

<template>
  <UButton
    :variant="nuxtUIVariant"
    :size="nuxtUISize"
    :color="variant === 'fill' || variant === 'border' ? 'primary' : undefined"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <slot />
  </UButton>
</template>
