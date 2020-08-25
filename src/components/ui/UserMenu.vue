<template>
  <dropdown v-if="user" class="mt-1" placement="bottom-end">
    <div class="flex items-center cursor-pointer select-none group">
      <div
        class="text-purple-700 group-hover:text-purple-600 p-0.5 transition rounded-full focus:text-purple-600 whitespace-no-wrap"
        :class="{ 'border-4 border-purple-300 hover:border-purple-400': user.isAdmin }"
      >
        <avatar :user="user" />
      </div>
    </div>
    <div slot="dropdown" class="mt-2 overflow-hidden text-sm bg-white rounded shadow-xl">
      <div class="block px-6 py-2 mb-1 bg-purple-100">
        <span class="block text-xs leading-3 text-purple-400">Welcome,</span>
        <span class="block mt-1 font-bold leading-none text-purple-600 text-md">{{ user.name }}</span>
      </div>
      <a
        class="block px-6 py-2 rounded-none hover:bg-purple-500 hover:text-white"
        :href="`https://jkaraoke.com/users/${user.id}`"
      >My Profile</a>
      <a
        class="block px-6 py-2 rounded-none hover:bg-purple-500 hover:text-white"
        href="https://jkaraoke.com/playlists"
      >My Playlists</a>
      <router-link
        class="block px-6 py-2 rounded-none hover:bg-purple-500 hover:text-white"
        to="/logout"
        method="post"
      >Logout</router-link>
    </div>
  </dropdown>
  <router-link v-else to="/login">
    <icon name="user-circle" class="w-10 h-10 text-purple-200" />
  </router-link>
</template>

<script>
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";

export default {
  name: "UserMenu",
  props: ["user"],
  components: { Dropdown, Avatar },
};
</script>

<style>
</style>
