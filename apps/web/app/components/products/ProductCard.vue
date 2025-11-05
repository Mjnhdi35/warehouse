<script setup lang="ts">
defineOptions({
  name: 'ProductCard',
});

import type { Product } from '~/composables/useProduct';

interface Props {
  /**
   * Product data
   */
  product: Product;
  /**
   * Card variant: 'default' | 'hover' | 'sales'
   */
  variant?: 'default' | 'hover' | 'sales';
  /**
   * Show quick actions on hover
   */
  showQuickActions?: boolean;
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showQuickActions: true,
  class: undefined,
});

const emit = defineEmits<{
  'quick-view': [];
  click: [];
}>();

const { isInWishlist } = useProduct();
const isHovered = ref(false);
const quickViewOpen = ref(false);

const productData = computed(() => ({
  id: props.product.id,
  title: props.product.title,
  image: props.product.image,
  price: props.product.price,
  originalPrice: props.product.originalPrice,
}));

const cardClasses = computed(() => [
  'relative group',
  'bg-white rounded-lg',
  'overflow-hidden',
  'transition-all duration-300',
  'hover:shadow-lg',
  props.class,
]);

const imageClasses = computed(() => [
  'w-full aspect-square object-cover',
  'transition-transform duration-300',
  isHovered.value && 'group-hover:scale-105',
]);
</script>

<template>
  <div
    :class="cardClasses"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="emit('click')"
  >
    <!-- Product Image -->
    <div class="relative overflow-hidden bg-gray-100">
      <img
        :src="product.image"
        :alt="product.title"
        :class="imageClasses"
      />

      <!-- Tag Badge -->
      <div
        v-if="product.tag || product.tagLabel"
        class="absolute top-4 left-4 z-10"
      >
        <Tag
          :variant="product.tag || 'default'"
          :label="product.tagLabel || 'New'"
        />
      </div>

      <!-- Quick Actions (on hover) -->
      <div
        v-if="showQuickActions"
        class="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <AddToWishlistButton
          :product-id="product.id"
          :product="productData"
          size="medium"
          @click.stop
        />
        <QuickViewButton
          :product-id="product.id"
          v-model:open="quickViewOpen"
          size="medium"
          @click.stop="emit('quick-view')"
        />
      </div>

      <!-- Add to Cart Button (on hover) -->
      <div
        v-if="showQuickActions"
        class="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <AddToCartButton
          :product="productData"
          variant="fill"
          size="large"
          class="w-full"
          @click.stop
        />
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <h3 class="body-medium-semibold text-gray-900 mb-2 line-clamp-2">
        {{ product.title }}
      </h3>

      <Price
        :price="product.price"
        :original-price="product.originalPrice"
        :show-sale="!!product.originalPrice && product.originalPrice > product.price"
        size="medium"
      />
    </div>
  </div>
</template>
