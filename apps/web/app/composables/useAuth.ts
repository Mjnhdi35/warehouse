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
    message: string = 'Đăng nhập thành công',
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
    error: string = 'Có lỗi xảy ra khi đăng nhập',
    redirectPath: string = '/auth/login',
  ) => {
    toast.add({
      title: 'Đăng nhập thất bại',
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
    toast.add({
      title: 'Đăng xuất thành công',
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
