<script setup lang="ts">
defineOptions({
  name: 'AddToCartButton',
});

interface Props {
  /**
   * Product data
   */
  product: {
    id: string | number;
    title: string;
    image?: string;
    price: number;
    originalPrice?: number;
  };
  /**
   * Button variant
   */
  variant?: 'fill' | 'border' | 'ghost';
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Quantity to add
   */
  quantity?: number;
  /**
   * Show icon
   */
  icon?: boolean;
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'fill',
  size: 'medium',
  quantity: 1,
  icon: true,
  class: undefined,
});

const { addToCart } = useProduct();
const isAdding = ref(false);

const handleAddToCart = async () => {
  isAdding.value = true;
  try {
    await addToCart(props.product, props.quantity);
  } finally {
    isAdding.value = false;
  }
};
</script>

<template>
  <Button
    :variant="variant"
    :size="size"
    :class="class"
    :disabled="isAdding"
    @click="handleAddToCart"
  >
    <Icon v-if="icon" name="i-lucide-shopping-cart" class="w-4 h-4" />
    <span>{{ isAdding ? 'Adding...' : 'Add to Cart' }}</span>
  </Button>
</template>
