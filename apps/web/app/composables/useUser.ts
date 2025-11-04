/**
 * Composable để quản lý user info và authentication state
 */
export const useUser = () => {
  const { isAuthenticated, getAccessToken } = useAuth();

  // User state
  const user = useState<{
    avatar?: string;
    displayName?: string;
    email?: string;
  } | null>('user', () => null);

  const loading = ref(false);

  /**
   * Fetch user info from API
   */
  const fetchUserInfo = async () => {
    if (!isAuthenticated.value) {
      user.value = null;
      loading.value = false;
      return;
    }

    // Don't fetch if already have user data
    if (user.value) {
      return;
    }

    loading.value = true;
    try {
      const token = getAccessToken();
      if (token.value) {
        const response = (await useApi('/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })) as {
          userId?: string;
          email?: string;
          firstName?: string;
          lastName?: string;
          displayName?: string;
          avatar?: string;
        };

        user.value = {
          email: response.email,
          displayName:
            response.displayName ||
            `${response.firstName || ''} ${response.lastName || ''}`.trim() ||
            response.email,
          avatar: response.avatar,
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
  watch(isAuthenticated, (authenticated) => {
    if (authenticated) {
      fetchUserInfo();
    } else {
      clearUser();
    }
  });

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
