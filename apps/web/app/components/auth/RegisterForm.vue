<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const router = useRouter();
const toast = useToast();

const schema = z
  .object({
    displayName: z
      .string()
      .min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' }),
    email: z.email({ message: 'Email không hợp lệ' }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type Schema = z.output<typeof schema>;

const fields: AuthFormField[] = [
  {
    name: 'displayName',
    type: 'text',
    label: 'Họ tên',
    placeholder: 'Nguyễn Văn A',
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
    label: 'Số điện thoại',
    placeholder: '0123456789',
    required: false,
    icon: 'i-lucide-phone',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Mật khẩu',
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Xác nhận mật khẩu',
    placeholder: '••••••••',
    required: true,
    icon: 'i-lucide-lock',
  },
];

const { isSubmitting, error, success, handleSubmit } = useForm<Schema>();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await handleSubmit(async (data) => {
    const { confirmPassword, ...registerData } = data;

    const response = await useApi<{ accessToken: string }>('/auth/register', {
      method: 'POST',
      body: registerData,
    });

    if (response.accessToken) {
      const token = useCookie('accessToken', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true,
        sameSite: 'strict',
      });
      token.value = response.accessToken;

      toast.add({
        title: 'Đăng ký thành công',
        color: 'success',
      });

      setTimeout(async () => {
        await router.push('/');
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
    title="Đăng ký"
    description="Tạo tài khoản mới"
    icon="i-lucide-user-plus"
    :loading="isSubmitting"
    @submit="onSubmit"
  >
    <template #validation>
      <UAlert
        v-if="success"
        color="success"
        variant="soft"
        title="Đăng ký thành công!"
        description="Đang chuyển hướng..."
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
        Đã có tài khoản?
        <ULink
          to="/auth/login"
          class="font-medium text-primary-600 dark:text-primary-400"
        >
          Đăng nhập ngay
        </ULink>
      </p>
    </template>
  </UAuthForm>
</template>
