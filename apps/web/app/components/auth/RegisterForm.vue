<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const toast = useToast();
const { setAccessToken } = useAuth();

const schema = z
  .object({
    displayName: z
      .string()
      .min(2, { message: 'Display name must be at least 2 characters' }),
    email: z.email({ message: 'Invalid email address' }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Schema = z.output<typeof schema>;

const fields: AuthFormField[] = [
  {
    name: 'displayName',
    type: 'text',
    label: 'Display Name',
    placeholder: 'John Doe',
    required: true,
    icon: 'i-lucide-user',
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'your@email.com',
    required: true,
    icon: 'i-lucide-mail',
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    placeholder: '+1234567890',
    required: false,
    icon: 'i-lucide-phone',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
];

const { isSubmitting, error, success, handleSubmit } = useForm<Schema>();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await handleSubmit(async (data) => {
    const { confirmPassword, ...registerData } = data;

    const response = (await useApi('/auth/register', {
      method: 'POST',
      body: registerData,
    })) as { accessToken: string };

    if (response.accessToken) {
      setAccessToken(response.accessToken);
      toast.add({
        title: 'Sign up successful',
        color: 'success',
      });

      setTimeout(() => {
        navigateTo('/');
      }, 2000);
    }

    return response;
  }, event);
};
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    title="Sign Up"
    description="Create a new account"
    icon="i-lucide-user-plus"
    :loading="isSubmitting"
    @submit="onSubmit"
  >
    <template #validation>
      <UAlert
        v-if="success"
        color="success"
        variant="soft"
        title="Sign up successful!"
        description="Redirecting..."
        icon="i-lucide-check-circle"
        class="mb-4"
      />
      <UAlert
        v-else-if="error"
        color="error"
        variant="soft"
        :title="error"
        icon="i-lucide-alert-circle"
        class="mb-4"
      />
    </template>

    <template #footer>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <ULink
          to="/auth/login"
          class="font-medium text-primary-600 dark:text-primary-400"
        >
          Sign in now
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
