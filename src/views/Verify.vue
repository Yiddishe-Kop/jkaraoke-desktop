<template>
  <div class="relative p-6 text-purple-900 bg-purple-100 rounded-lg no-drag">
    <logo class="relative w-48 h-24 ml-3 pointer-events-none bottom-36" />

    <div class="w-56 mt-4 text-center">
      <h1 class="-mt-24 text-3xl font-black leading-none">Account Verification</h1>
      <div class="mt-6 space-y-3 text-sm leading-5 text-purple-700">
        <p>We haven't been able to connect to jKaraoke's servers for a month already.</p>
        <p>In order to continue using the app, please go online so we can verify your subscription status</p>
      </div>
      <button
        @click="tryToConnect"
        class="px-3 py-2 mt-5 text-purple-200 bg-purple-900 rounded hover:bg-purple-1000"
      >Try now</button>
    </div>
  </div>
</template>

<script>
import Logo from '../components/ui/Logo';

export default {
  name: 'Verify',
  components: { Logo },
  watch: {
    '$store.getters.needsBillingCheck': {
      handler: function (doesHe) {
        console.log('DOES HE?', doesHe);
        if (!doesHe) {
          this.$router.push({ name: 'Home' });
        }
      },
      immediate: true,
    },
  },
  methods: {
    tryToConnect() {
      this.$store.dispatch('getUserData');
    },
  },
};
</script>
