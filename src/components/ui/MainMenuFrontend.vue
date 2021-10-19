<template>
  <nav class="flex items-center justify-center space-x-6 abs-center">
    <router-link
      v-for="item in menuItems"
      :key="item.route"
      :to="item.route"
      class="flex items-center space-x-2 text-purple-100 transition no-fx hover:text-purple-300"
    >
      <icon :name="item.icon" class="w-6 text-purple-300" />
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'MainMenu',
  data() {
    return {
      menuItems: [
        {
          label: 'Music',
          route: '/',
          icon: 'music',
          matcher: 'music',
        },
      ],
    };
  },
};
</script>

<style>
</style>
