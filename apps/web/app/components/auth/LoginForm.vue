<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const { handleAuthSuccess } = useAuth();

const schema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type Schema = z.output<typeof schema>;

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'your@email.com',
    required: true,
    icon: 'i-lucide-mail',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
];

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
      handleAuthSuccess(response.accessToken, 'Sign in successful');
    }

    return response;
  }, event);
};
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    title="Sign In"
    description="Sign in to your account"
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
        Don't have an account?
        <ULink
          to="/auth/register"
          class="font-medium text-primary-600 dark:text-primary-400"
        >
          Sign up now
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
