import type { FormSubmitEvent } from '@nuxt/ui';

/**
 * Composable để quản lý form state và validation
 */
export const useForm = <T extends Record<string, unknown>>() => {
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  /**
   * Handle form submission với error handling
   */
  const handleSubmit = async (
    submitFn: (data: T) => Promise<unknown>,
    event: FormSubmitEvent<T>,
  ) => {
    if (isSubmitting.value) return;

    error.value = null;
    success.value = false;
    isSubmitting.value = true;

    try {
      const result = await submitFn(event.data);
      success.value = true;
      return result;
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      error.value =
        errorObj.data?.message || errorObj.message || 'Có lỗi xảy ra';
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Reset form state
   */
  const reset = () => {
    isSubmitting.value = false;
    error.value = null;
    success.value = false;
  };

  return {
    isSubmitting: readonly(isSubmitting),
    error: readonly(error),
    success: readonly(success),
    handleSubmit,
    reset,
  };
};
