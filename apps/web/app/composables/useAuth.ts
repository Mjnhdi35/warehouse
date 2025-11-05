/**
 * Composable để quản lý authentication state và token storage
 */
export const useAuth = () => {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18n();

  /**
   * Access token cookie - shared state
   */
  const accessTokenCookie = useCookie<string | null>('accessToken', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: true,
    sameSite: 'strict',
    default: () => null,
  });

  /**
   * Get access token cookie
   */
  const getAccessToken = () => {
    return accessTokenCookie;
  };

  /**
   * Set access token cookie
   */
  const setAccessToken = (token: string) => {
    accessTokenCookie.value = token;
    return accessTokenCookie;
  };

  /**
   * Remove access token cookie (logout)
   */
  const removeAccessToken = () => {
    accessTokenCookie.value = null;
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => {
    return !!accessTokenCookie.value;
  });

  /**
   * Handle successful authentication
   * - Store token
   * - Show success toast
   * - Redirect to home
   */
  const handleAuthSuccess = (
    token: string,
    message?: string,
    redirectPath: string = '/',
  ) => {
    setAccessToken(token);
    toast.add({
      title: message || t('auth.signInSuccess'),
      color: 'success',
    });
    router.push(redirectPath);
  };

  /**
   * Handle authentication error
   * - Show error toast
   * - Redirect to login
   */
  const handleAuthError = (
    error?: string,
    redirectPath: string = '/auth/login',
  ) => {
    toast.add({
      title: t('auth.signInFailed'),
      description: error || t('auth.anErrorOccurredWhileSigningIn'),
      color: 'error',
    });
    router.push(redirectPath);
  };

  /**
   * Logout user
   * - Remove token
   * - Show success toast
   * - Redirect to login
   */
  const logout = (redirectPath: string = '/auth/login') => {
    removeAccessToken();
    // Clear user info if useUser is available
    try {
      const { clearUser } = useUser();
      clearUser();
    } catch {
      // useUser might not be available, ignore
    }
    toast.add({
      title: t('auth.signOutSuccess'),
      color: 'success',
    });
    router.push(redirectPath);
  };

  return {
    getAccessToken,
    setAccessToken,
    removeAccessToken,
    isAuthenticated,
    handleAuthSuccess,
    handleAuthError,
    logout,
  };
};
