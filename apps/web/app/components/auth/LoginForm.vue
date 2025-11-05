<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const { handleAuthSuccess } = useAuth();
const { t } = useI18n();

const createSchema = () =>
  z.object({
    email: z.email({ message: t('auth.invalidEmail') }),
    password: z.string().min(6, { message: t('auth.passwordMinLength') }),
  });

type Schema = z.infer<ReturnType<typeof createSchema>>;

const schema = computed(createSchema);

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: 'your@email.com',
    required: true,
    icon: 'i-lucide-mail',
  },
  {
    name: 'password',
    type: 'password',
    label: t('auth.password'),
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
]);

const handleGoogleLogin = () => {
  if (import.meta.client) {
    window.location.href = '/api/auth/google';
  } else {
    navigateTo('/api/auth/google', { external: true });
  }
};

const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: handleGoogleLogin,
  },
];

const { isSubmitting, error, handleSubmit } = useForm<Schema>();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await handleSubmit(async (data) => {
    const response = (await useApi('/auth/login', {
      method: 'POST',
      body: data,
    })) as { accessToken: string };

    if (response.accessToken) {
      handleAuthSuccess(response.accessToken);
    }

    return response;
  }, event);
};
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :title="t('auth.signIn')"
    :description="t('auth.signInToAccount')"
    icon="i-lucide-lock"
    :loading="isSubmitting"
    :providers="providers"
    @submit="onSubmit"
  >
    <template #validation>
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :title="error"
        icon="i-lucide-alert-circle"
        class="mb-2"
      />
    </template>

    <template #footer>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ t('auth.dontHaveAccount') }}
        <ULink
          to="/auth/register"
          class="font-medium text-primary-600 dark:text-primary-400"
        >
          {{ t('auth.signUpNow') }}
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
