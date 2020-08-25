<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-purple-700 bg-opacity-50"
    v-if="show"
    @click="$emit('update:show', false)"
  >
    <section class="bg-white rounded-lg shadow-2xl">
      <p class="m-2 text-sm">Please choose a playlist:</p>
      <ul
        v-if="$page.auth.playlists.length"
        class="p-2 mt-2 space-y-1 overflow-y-auto select-none max-h-80"
      >
        <li
          v-for="playlist in $page.auth.playlists"
          :key="playlist.id"
          class="font-semibold text-purple-100 bg-purple-900 rounded-md cursor-pointer hover:bg-purple-1000 hover:text-brand"
        >
          <router-link
            :to="route('playlist.add', { playlist: playlist.id, song: songId })"
            preserve-state
            preserve-scroll
            method="post"
            class="block p-2 rounded-md"
          >{{ playlist.name }}</router-link>
        </li>
      </ul>
      <div v-else class="py-8 text-center">
        <router-link
          :to="route('playlist.index')"
          class="px-3 py-1 m-2 mt-0 text-sm font-semibold text-center bg-purple-1000 text-brand"
        >Create a playlist</router-link>
      </div>
      <router-link
        :to="route('playlist.index')"
        class="block p-2 m-2 mt-0 text-xs font-semibold text-center text-purple-900 opacity-75 hover:opacity-100 bg-brand"
      >Manage playlists</router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: "PlaylistSelectorPopup",
  props: ["show", "songId"],
};
</script>

<style>
</style>
