/**
 * User info interface
 */
export interface UserInfo {
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
}

/**
 * Composable để quản lý user info và authentication state
 */
export const useUser = () => {
  const { isAuthenticated, getAccessToken } = useAuth();

  // User state - shared across components
  const user = useState<UserInfo | null>('user', () => null);
  const loading = useState<boolean>('user-loading', () => false);

  /**
   * Fetch user info from API
   */
  const fetchUserInfo = async (force = false) => {
    if (!isAuthenticated.value) {
      user.value = null;
      loading.value = false;
      return;
    }

    // Don't fetch if already have user data (unless forced)
    if (user.value && !force) {
      return;
    }

    loading.value = true;
    try {
      const token = getAccessToken();
      if (token.value) {
        const response = await useApi<UserInfo>('/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        user.value = {
          ...response,
          displayName:
            response.displayName ||
            `${response.firstName || ''} ${response.lastName || ''}`.trim() ||
            response.email ||
            '',
        };
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear user info
   */
  const clearUser = () => {
    user.value = null;
    loading.value = false;
  };

  // Watch authentication state and fetch user info
  watch(
    isAuthenticated,
    (authenticated) => {
      if (authenticated) {
        fetchUserInfo();
      } else {
        clearUser();
      }
    },
    { immediate: true },
  );

  // Fetch on client mount if authenticated
  if (import.meta.client) {
    onMounted(() => {
      if (isAuthenticated.value && !user.value) {
        fetchUserInfo();
      }
    });
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    fetchUserInfo,
    clearUser,
  };
};
