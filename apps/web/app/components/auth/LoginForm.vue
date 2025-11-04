<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const router = useRouter();
const toast = useToast();

const schema = z.object({
  email: z.email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
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
    label: 'Mật khẩu',
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
];
const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: 'Google', description: 'Login with Google' });
    },
  },
];

const { isSubmitting, error, handleSubmit } = useForm<Schema>();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await handleSubmit(async (data) => {
    const response = await useApi<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: data,
    });

    // Store token
    if (response.accessToken) {
      const token = useCookie('accessToken', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true,
        sameSite: 'strict',
      });
      token.value = response.accessToken;

      toast.add({
        title: 'Đăng nhập thành công',
        color: 'success',
      });

      await router.push('/');
    }

    return response;
  }, event);
};
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    title="Đăng nhập"
    description="Đăng nhập vào tài khoản của bạn"
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
        class="mb-4"
      />
    </template>

    <template #footer>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Chưa có tài khoản?
        <ULink
          to="/auth/register"
          class="font-medium text-primary-600 dark:text-primary-400"
        >
          Đăng ký ngay
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
