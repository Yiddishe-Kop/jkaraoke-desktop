<template>
  <div class="bg-purple-1000">
    <portal-target name="dropdown" slim />
    <div class="flex flex-col h-screen text-purple-100">
      <!-- Header -->
      <div class="flex-shrink-0 md:flex">
        <div
          class="relative z-10 flex items-center justify-between w-full px-4 py-2 text-sm md:px-12 md:text-md draggable"
        >
          <logo class="w-32 h-12 mr-4" />
          <main-menu />
          <user-menu :user="auth.user" />
        </div>
      </div>
      <!-- /Header -->

      <div class="flex flex-grow overflow-hidden">
        <div class="flex-1 p-2 overflow-y-auto md:px-4">
          <router-view />
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
  computed: {
    ...mapState(['auth']),
  },
};
</script>

<style>
</style>
