<template>
  <div class="relative p-6 text-purple-900 bg-purple-100 rounded-lg no-drag">
    <logo class="relative w-48 h-24 bottom-36" />

    <div class="mt-4 text-center">
      <h1 class="-mt-24 text-3xl font-black">Welcome!</h1>
      <p class="text-sm leading-4 text-purple-700">Please log in to your account</p>
    </div>

    <form @submit.prevent="login" class="flex flex-col mt-6">
      <label for="email">Email</label>
      <input v-model="email" type="email" id="email" class="form-input" />
      <label for="password" class="mt-2">Password</label>
      <input v-model="password" type="password" id="password" class="form-input" />
      <loading-button
        :loading="sending"
        class="block py-2 mt-3 text-purple-100 rounded-md bg-purple-1000 hover:bg-purple-900"
        type="submit"
      >Log In</loading-button>

      <p v-if="err" class="mt-2 text-xs leading-4 text-red-600">{{ err }}</p>
      <p class="mt-6 text-sm leading-4 text-center">Don't have an account?</p>
      <button
        type="button"
        @click="register"
        class="block py-2 mt-3 text-purple-100 bg-purple-800 rounded-md hover:bg-purple-900"
      >Sign up</button>
    </form>
  </div>
</template>

<script>
import Logo from '../components/ui/Logo';
import LoadingButton from '@/components/ui/LoadingButton';
import { shell } from 'electron';

export default {
  name: 'Login',
  components: { Logo, LoadingButton },
  data() {
    return {
      email: '',
      password: '',
      sending: false,
      err: null,
    };
  },
  watch: {
    '$store.state.auth.user': function (user) {
      if (!!user) {
        this.$router.push({ name: 'Home' });
      }
    },
  },
  methods: {
    async login() {
      this.sending = true;
      try {
        const res = await this.$http.post('/auth/login', {
          email: this.email,
          password: this.password,
        });
        this.err = null;
        localStorage.setItem('token', res.data.access_token);
        this.$store.dispatch('getUserData');
      } catch (err) {
        console.log({ err });
        this.err = 'Sorry, unauthorized.';
      }
      this.sending = false;
    },
    register() {
      shell.openExternal('https://jkaraoke.com/register');
    },
  },
};
</script>

<style>
label {
  @apply text-sm font-semibold;
}
</style>
