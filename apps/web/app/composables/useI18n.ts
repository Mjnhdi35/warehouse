import type { Locale, Messages } from '@nuxt/ui';

/**
 * Composable để quản lý i18n và locale
 */
export const useI18n = () => {
  const locale = useState<Locale<Messages> | null>('locale', () => null);

  // Load default locale on client mount
  if (import.meta.client) {
    onMounted(async () => {
      if (!locale.value) {
        const localeModule = await import('~/locales/en');
        locale.value = localeModule.default;
      }
    });
  }

  /**
   * Set locale
   */
  const setLocale = async (localeCode: 'en' | 'vi') => {
    const localeModule = await import(`~/locales/${localeCode}`);
    locale.value = localeModule.default;
  };

  /**
   * Get translation by key path
   */
  const t = (key: string): string => {
    if (!locale.value?.messages) {
      return key;
    }

    const keys = key.split('.');
    let value: unknown = locale.value.messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return {
    locale: readonly(locale),
    setLocale,
    t,
  };
};
