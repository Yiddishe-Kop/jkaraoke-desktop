<template>
  <div>
    <portal-target name="dropdown" slim />
    <div class="flex flex-col h-full" @click="hideDropdownMenus">
      <!-- Header -->
      <div class="flex-shrink-0 md:flex">
        <div
          class="relative flex items-center justify-between w-full px-4 py-2 text-sm bg-purple-900 md:px-12 md:text-md draggable"
        >
          <logo class="w-32 h-12 mr-4" />
          <main-menu />
          <user-menu :user="auth.user" />
        </div>
      </div>
      <div
        v-if="auth.trialDaysLeft"
        class="flex items-center justify-center px-6 py-2 space-x-2 bg-pink-200"
      >
        <icon name="gift" class="w-4 text-pink-700" />
        <span class="text-sm text-pink-900">
          <strong>{{ auth.trialDaysLeft }} {{ auth.trialDaysLeft == 1 ? 'day' : 'days' }}</strong>
          left in your trial!
        </span>
      </div>
      <!-- /Header -->

      <div class="flex flex-grow overflow-hidden bg-purple-100">
        <div class="flex-1 overflow-y-auto" scroll-region>
          <transition name="slideUp">
            <slot />
          </transition>
        </div>
      </div>
    </div>
    <modal />
  </div>
</template>

<script>
import Logo from '@/components/ui/Logo';
import UserMenu from '@/components/ui/UserMenu';
import Modal from '@/components/ui/Modal';
import MainMenu from '@/components/ui/MainMenuFrontend';
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  components: { UserMenu, Logo, MainMenu, Modal },
  data() {
    return {
      showUserMenu: false,
    };
  },
  computed: {
    ...mapState(['auth']),
  },
  methods: {
    url() {
      return location.pathname.substr(1) + location.search;
    },
    hideDropdownMenus() {
      this.showUserMenu = false;
    },
  },
};
</script>

<style>
</style>
