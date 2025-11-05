<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const toast = useToast();
const { setAccessToken } = useAuth();
const { t } = useI18n();

// Schema builder function for type inference
const createSchema = () =>
  z
    .object({
      displayName: z
        .string()
        .min(2, { message: t('auth.displayNameMinLength') }),
      email: z.email({ message: t('auth.invalidEmail') }),
      phone: z.string().optional(),
      password: z.string().min(6, { message: t('auth.passwordMinLength') }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });

// Extract type from schema builder
type Schema = z.infer<ReturnType<typeof createSchema>>;

// Schema needs to be computed for reactivity with i18n
const schema = computed(createSchema);

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'displayName',
    type: 'text',
    label: t('auth.displayName'),
    placeholder: 'John Doe',
    required: true,
    icon: 'i-lucide-user',
  },
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: 'your@email.com',
    required: true,
    icon: 'i-lucide-mail',
  },
  {
    name: 'phone',
    type: 'text',
    label: t('auth.phone'),
    placeholder: '+1234567890',
    required: false,
    icon: 'i-lucide-phone',
  },
  {
    name: 'password',
    type: 'password',
    label: t('auth.password'),
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: t('auth.confirmPassword'),
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
]);

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
        title: t('auth.signUpSuccess'),
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
    :title="t('auth.signUp')"
    :description="t('auth.createNewAccount')"
    icon="i-lucide-user-plus"
    :loading="isSubmitting"
    @submit="onSubmit"
  >
    <template #validation>
      <UAlert
        v-if="success"
        color="success"
        variant="soft"
        :title="t('auth.signUpSuccess')"
        :description="t('auth.redirecting')"
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
        {{ t('auth.alreadyHaveAccount') }}
        <ULink
          to="/auth/login"
          class="font-medium text-primary-600 dark:text-primary-400"
        >
          {{ t('auth.signInNow') }}
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
