<script setup lang="ts">
defineOptions({
  name: 'AppPrice',
});

interface Props {
  /**
   * Price value
   */
  price: number | string;
  /**
   * Original price (for sale price display)
   */
  originalPrice?: number | string;
  /**
   * Size variant: 'small' | 'medium' | 'big'
   */
  size?: 'small' | 'medium' | 'big';
  /**
   * Show sale badge
   */
  showSale?: boolean;
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showSale: false,
  class: undefined,
});

const formatPrice = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

const priceClasses = computed(() => {
  const base = ['font-semibold text-gray-900'];
  switch (props.size) {
    case 'small':
      return [...base, 'body-small-semibold'];
    case 'big':
      return [...base, 'text-[36px] leading-[1.2]'];
    default:
      return [...base, 'body-xl-semibold'];
  }
});

const originalPriceClasses = computed(() => [
  'line-through text-gray-400',
  props.size === 'small' ? 'body-tiny' : 'body-medium',
]);
</script>

<template>
  <div :class="['flex items-center gap-2', class]">
    <span :class="priceClasses">
      {{ formatPrice(price) }}
    </span>

    <template v-if="originalPrice">
      <template
        v-if="
          (typeof originalPrice === 'number'
            ? originalPrice
            : parseFloat(originalPrice)) >
          (typeof price === 'number' ? price : parseFloat(price))
        "
      >
        <span :class="originalPriceClasses">
          {{ formatPrice(originalPrice) }}
        </span>
        <span
          v-if="showSale"
          class="inline-flex items-center px-2 py-1 rounded bg-danger text-white body-tiny-medium"
        >
          Sale
        </span>
      </template>
    </template>
  </div>
</template>
