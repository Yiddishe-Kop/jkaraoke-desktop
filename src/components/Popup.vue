<template>
  <transition name="popup">
    <div
      class="absolute z-50 origin-top-right bg-purple-100 shadow-xl w-80 top-6 right-6 rounded-xl text-purple-1000"
    >
      <div @click.self="$emit('update:show-popup', false)" class="fixed inset-0 z-0"></div>
      <div class="relative z-50 flex justify-center mt-2 space-x-2 text-sm">
        <button
          @click.stop="$emit('update:tab', 'search')"
          class="p-1 font-bold border-b-2 rounded-none"
          :class="[tab == 'search' ? 'text-purple-800 border-purple-700' : 'text-purple-400 border-purple-200']"
        >
          <icon name="search" class="inline w-4" />Search
        </button>
        <button
          @click.stop="$emit('update:tab', 'playlist')"
          class="p-1 font-bold border-b-2 rounded-none"
          :class="[tab == 'playlist' ? 'text-purple-800 border-purple-700' : 'text-purple-400 border-purple-200']"
        >
          <icon name="list" class="inline w-4" />Playlists
        </button>
      </div>
      <div v-if="tab == 'search'">
        <div class="relative z-50 m-2">
          <input
            v-model="query"
            type="text"
            @keyup.enter="search"
            class="w-full p-3 pr-10 text-purple-100 rounded-lg bg-purple-1000"
            placeholder="Search for songs, artists..."
            ref="input"
          />
          <icon name="search" class="absolute top-0 bottom-0 w-5 my-auto text-purple-300 right-3" />
        </div>
        <div class="relative z-50 p-2 overflow-y-auto max-h-56">
          <loader v-if="isLoading" class="my-12" />
          <ul v-else-if="songs.length" class="select-none">
            <song-item v-for="song in songs" :key="song.id" :song="song" />
            <!-- <song-item v-for="song in songs" :key="song.id" :song="song" @add-to-playlist="showPlaylists" /> -->
          </ul>
          <p v-else class="py-12 text-center text-purple-500">Search for something!</p>
        </div>
      </div>
      <div v-else-if="tab == 'playlist'" class="relative z-50 p-2 overflow-y-auto max-h-96">
        <!-- <playlist-viewer /> -->
      </div>
      <!-- <playlist-selector-popup :show.sync="playlistsPopup.show" :songId="playlistsPopup.songId" class="z-50" /> -->
    </div>
  </transition>
</template>

<script>
import { timestamp } from "@/helpers/filters";
import SongItem from "@/components/ui/SongItem";
// import PlaylistViewer from '@/components/PlaylistViewer';
// import PlaylistSelectorPopup from '@/components/ui/PlaylistSelectorPopup';
// import addToPlaylist from '@/mixins/addToPlaylist';

export default {
  name: "Popup",
  components: { SongItem /* PlaylistViewer, PlaylistSelectorPopup */ },
  props: ["showPopup", "tab"],
  // mixins: [addToPlaylist],
  data() {
    return {
      query: "",
      isLoading: false,
      songs: [],
    };
  },
  filters: {
    timestamp,
  },
  methods: {
    async search() {
      this.isLoading = true;
      let results = await this.$http.get("songs/search", {
        params: {
          search: this.query,
        },
      });
      this.isLoading = false;
      this.songs = results.data;
    },
  },
  watch: {
    async showPopup(newVal) {
      if (newVal && this.tab == "search") {
        await this.$nextTick();
        this.$refs.input.focus();
      }
    },
  },
};
</script>

<style>
</style>
