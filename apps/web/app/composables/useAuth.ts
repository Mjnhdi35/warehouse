/**
 * Composable để quản lý authentication state và token storage
 */
export const useAuth = () => {
  const router = useRouter();
  const toast = useToast();

  /**
   * Get access token cookie
   */
  const getAccessToken = () => {
    return useCookie('accessToken', {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: true,
      sameSite: 'strict',
    });
  };

  /**
   * Set access token cookie
   */
  const setAccessToken = (token: string) => {
    const tokenCookie = getAccessToken();
    tokenCookie.value = token;
    return tokenCookie;
  };

  /**
   * Remove access token cookie (logout)
   */
  const removeAccessToken = () => {
    const tokenCookie = getAccessToken();
    tokenCookie.value = null;
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => {
    const token = getAccessToken();
    return !!token.value;
  });

  /**
   * Handle successful authentication
   * - Store token
   * - Show success toast
   * - Redirect to home
   */
  const handleAuthSuccess = (
    token: string,
    message: string = 'Sign in successful',
    redirectPath: string = '/',
  ) => {
    setAccessToken(token);
    toast.add({
      title: message,
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
    error: string = 'An error occurred while signing in',
    redirectPath: string = '/auth/login',
  ) => {
    toast.add({
      title: 'Sign in failed',
      description: error,
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
      title: 'Sign out successful',
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
