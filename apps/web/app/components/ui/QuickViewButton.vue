<script setup lang="ts">
defineOptions({
  name: 'QuickViewButton',
});

interface Props {
  /**
   * Product ID
   */
  productId: string | number;
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Show label
   */
  showLabel?: boolean;
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showLabel: false,
  class: undefined,
});

const emit = defineEmits<{
  click: [];
}>();

const isOpen = defineModel<boolean>('open', { default: false });

const handleClick = () => {
  isOpen.value = true;
  emit('click');
};

const buttonSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-9 h-9';
    case 'large':
      return 'w-12 h-12';
    default:
      return 'w-10 h-10';
  }
});
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center',
      'rounded-full transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      'bg-white text-gray-900 hover:bg-primary hover:text-white',
      'shadow-md',
      buttonSize,
      class,
    ]"
    @click="handleClick"
  >
    <Icon
      name="i-lucide-eye"
      :class="[
        props.size === 'small' ? 'w-4 h-4' : props.size === 'large' ? 'w-6 h-6' : 'w-5 h-5',
      ]"
    />
    <span
      v-if="showLabel"
      class="ml-2 body-small-medium"
    >
      Quick View
    </span>
  </button>
</template>

