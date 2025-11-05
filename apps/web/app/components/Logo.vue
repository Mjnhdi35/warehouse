<script setup lang="ts">
defineOptions({
  name: 'AppLogo',
});

interface Props {
  /**
   * Text hiển thị cho logo
   */
  text?: string;
  /**
   * Link khi click vào logo (mặc định là homepage)
   */
  to?: string;
  /**
   * Size của logo: 'sm' | 'md' | 'lg' | 'xl'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Icon hiển thị bên cạnh text
   */
  icon?: string;
  /**
   * Image source cho logo (ưu tiên hơn icon)
   */
  image?: string;
  /**
   * Alt text cho image
   */
  alt?: string;
  /**
   * Có hiển thị icon/image ở bên trái text không
   */
  leading?: boolean;
  /**
   * Có hiển thị icon/image ở bên phải text không
   */
  trailing?: boolean;
  /**
   * Custom class cho logo
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Warehouse',
  to: '/',
  size: 'md',
  leading: true,
  trailing: false,
  alt: 'Warehouse Logo',
  icon: undefined,
  image: undefined,
  class: undefined,
});

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

const iconSizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
};

const logoClasses = computed(() => [
  'inline-flex items-center gap-2 font-bold',
  'hover:opacity-80 transition-opacity',
  sizeClasses[props.size],
  props.class,
]);
</script>

<template>
  <ULink
    :to="to"
    :class="logoClasses"
    :aria-label="alt"
    :external="to?.startsWith('http')"
    raw
  >
    <!-- Leading Icon/Image -->
    <Icon
      v-if="leading && icon && !image"
      :name="icon"
      :class="iconSizeClasses[size]"
    />
    <img
      v-else-if="leading && image"
      :src="image"
      :alt="alt"
      :class="iconSizeClasses[size]"
      class="object-contain"
    />

    <!-- Default Icon (only if no icon/image and no text) -->
    <Icon
      v-else-if="!leading && !trailing && !icon && !image && !text"
      name="i-lucide-warehouse"
      :class="iconSizeClasses[size]"
    />

    <!-- Text -->
    <span v-if="text" class="font-semibold">{{ text }}</span>

    <!-- Trailing Icon/Image -->
    <Icon
      v-if="trailing && icon && !image"
      :name="icon"
      :class="iconSizeClasses[size]"
    />
    <img
      v-else-if="trailing && image"
      :src="image"
      :alt="alt"
      :class="iconSizeClasses[size]"
      class="object-contain"
    />
  </ULink>
</template>
