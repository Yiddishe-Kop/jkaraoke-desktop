<template>
  <div id="app" class="text-gray-800 bg-purple-100">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || "default") + "-layout";
    },
  },
};
</script>

<style lang="scss">
</style>
