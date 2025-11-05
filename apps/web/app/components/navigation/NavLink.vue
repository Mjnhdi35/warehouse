<script setup lang="ts">
defineOptions({
  name: 'NavLink',
});

interface Props {
  /**
   * Link text
   */
  label: string;
  /**
   * Link URL
   */
  to?: string;
  /**
   * Link state: 'default' | 'hover' | 'active'
   */
  state?: 'default' | 'hover' | 'active';
  /**
   * Is active link
   */
  active?: boolean;
  /**
   * Custom class
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  state: 'default',
  active: false,
  class: undefined,
});

const route = useRoute();

const isActive = computed(() => {
  if (props.active) return true;
  if (props.to && typeof props.to === 'string') {
    return route.path === props.to || route.path.startsWith(props.to);
  }
  return false;
});

const linkState = computed(() => {
  if (isActive.value) return 'active';
  return props.state;
});

const linkClasses = computed(() => {
  const base = [
    'inline-flex items-center',
    'px-4 py-3',
    'body-medium-medium',
    'rounded-lg',
    'transition-colors duration-200',
  ];

  switch (linkState.value) {
    case 'active':
      return [...base, 'bg-primary text-white'];
    case 'hover':
      return [...base, 'bg-primary-soft text-primary-hard'];
    default:
      return [
        ...base,
        'text-gray-700',
        'hover:bg-primary-soft hover:text-primary-hard',
      ];
  }
});
</script>

<template>
  <ULink v-if="to" :to="to" :class="linkClasses">
    {{ label }}
  </ULink>
  <span v-else :class="linkClasses">
    {{ label }}
  </span>
</template>
