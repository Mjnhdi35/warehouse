<script setup lang="ts">
defineOptions({
  name: 'AddToWishlistButton',
});

interface Props {
  /**
   * Product ID
   */
  productId: string | number;
  /**
   * Product data
   */
  product?: {
    id: string | number;
    title: string;
    image?: string;
    price: number;
    originalPrice?: number;
  };
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

const { addToWishlist, removeFromWishlist, isInWishlist } = useProduct();

const inWishlist = computed(() => isInWishlist(props.productId));
const isToggling = ref(false);

const handleToggle = async () => {
  if (!props.product) return;

  isToggling.value = true;
  try {
    if (inWishlist.value) {
      await removeFromWishlist(props.productId);
    } else {
      await addToWishlist(props.product);
    }
  } finally {
    isToggling.value = false;
  }
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
      buttonSize,
      inWishlist
        ? 'bg-primary text-white hover:bg-primary-hard'
        : 'bg-white text-gray-900 hover:bg-primary hover:text-white',
      'shadow-md',
      class,
    ]"
    :disabled="isToggling"
    @click="handleToggle"
  >
    <Icon
      :name="inWishlist ? 'i-lucide-heart' : 'i-lucide-heart'"
      :class="[
        props.size === 'small' ? 'w-4 h-4' : props.size === 'large' ? 'w-6 h-6' : 'w-5 h-5',
        inWishlist && 'fill-current',
      ]"
    />
    <span
      v-if="showLabel"
      class="ml-2 body-small-medium"
    >
      {{ inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
    </span>
  </button>
</template>

