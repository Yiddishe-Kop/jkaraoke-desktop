<template>
  <div id="app">
    <component :is="layout" class="w-screen h-screen text-gray-800 bg-purple-100">
      <router-view />
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout';
    },
  },
  methods: {
    monitorOnlineStatus() {
      if (navigator.onLine) {
        this.$store.dispatch('goOnline');
      } else {
        this.$store.commit('GO_OFFLINE');
      }
    },
  },
  mounted() {
    window.addEventListener('online', this.monitorOnlineStatus);
    window.addEventListener('offline', this.monitorOnlineStatus);
    this.monitorOnlineStatus();
  },
};
</script>

<style lang="scss">
</style>
