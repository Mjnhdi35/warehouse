import type { Locale, Messages } from '@nuxt/ui';

/**
 * Composable để quản lý i18n và locale
 * Sử dụng locale từ UApp component khi có sẵn
 */
export const useI18n = () => {
  // Get locale from UApp if available, otherwise use state
  const appLocale = useState<Locale<Messages> | null>('app-locale', () => null);

  // Current locale state
  const currentLocale = useState<Locale<Messages> | null>(
    'current-locale',
    () => null,
  );

  // Computed locale (prefer app locale over current locale)
  const locale = computed(() => appLocale.value || currentLocale.value);

  // Load default locale on client mount if not set
  if (import.meta.client) {
    onMounted(async () => {
      if (!locale.value) {
        const localeModule = await import('~/locales/en');
        currentLocale.value = localeModule.default as Locale<Messages>;
      }
    });
  }

  /**
   * Set locale (for UApp component)
   */
  const setAppLocale = (locale: Locale<Messages>) => {
    appLocale.value = locale;
  };

  /**
   * Set locale (for user preference)
   */
  const setLocale = async (localeCode: 'en' | 'vi') => {
    // Dynamic import with variable - Vite cannot analyze this at build time
    const localeModule = await import(
      /* @vite-ignore */
      `~/locales/${localeCode}`
    );
    currentLocale.value = localeModule.default as Locale<Messages>;
  };

  /**
   * Get translation by key path
   * Returns a function that is reactive to locale changes
   */
  const t = (key: string): string => {
    const currentLocaleValue = locale.value;
    if (!currentLocaleValue || !('messages' in currentLocaleValue)) {
      return key;
    }

    const currentMessages = (currentLocaleValue as Locale<Messages>).messages;
    if (!currentMessages) {
      return key;
    }

    const keys = key.split('.');
    let value: unknown = currentMessages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  /**
   * Get translation as computed (reactive)
   */
  const useT = (key: string) => {
    return computed(() => t(key));
  };

  return {
    locale: readonly(locale),
    setAppLocale,
    setLocale,
    t,
    useT,
  };
};
