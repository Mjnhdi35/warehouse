import type { Locale, Messages } from '@nuxt/ui';
import { en } from '@nuxt/ui/locale';

export default extendLocale(en, {
  code: 'en',
  messages: {
    ...en.messages,
    // Custom messages
    // @ts-expect-error - Custom messages not in Messages type
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      signInSuccess: 'Sign in successful',
      signUpSuccess: 'Sign up successful',
      signOutSuccess: 'Sign out successful',
      signInFailed: 'Sign in failed',
      signUpFailed: 'Sign up failed',
      signInWithGoogle: 'Sign in with Google',
      signInWithGoogleSuccess: 'Sign in with Google successful',
      signInWithGoogleError: 'An error occurred while signing in with Google',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      displayName: 'Display Name',
      phone: 'Phone',
      signInToAccount: 'Sign in to your account',
      createNewAccount: 'Create a new account',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      signUpNow: 'Sign up now',
      signInNow: 'Sign in now',
      redirecting: 'Redirecting...',
      processingGoogleSignIn: 'Processing Google sign in...',
      invalidEmail: 'Invalid email address',
      passwordMinLength: 'Password must be at least 6 characters',
      displayNameMinLength: 'Display name must be at least 2 characters',
      passwordsDoNotMatch: 'Passwords do not match',
      anErrorOccurred: 'An error occurred',
      anErrorOccurredWhileSigningIn: 'An error occurred while signing in',
    },
    user: {
      profile: 'Profile',
      settings: 'Settings',
      userMenu: 'User menu',
    },
    common: {
      home: 'Home',
      loading: 'Loading...',
    },
  },
}) as Locale<Messages>;
