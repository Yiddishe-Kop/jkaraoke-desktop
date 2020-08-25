<template>
  <div class="flex flex-col h-full bg-purple-900">
    <h1
      class="my-8 text-2xl font-extrabold leading-10 tracking-tight text-center text-purple-500 sm:text-4xl sm:leading-none md:text-5xl"
    >Music Library</h1>

    <!-- Search Bar -->
    <div
      class="flex items-center w-2/3 max-w-xl p-3 mx-auto space-x-3 bg-purple-200 rounded-xl focus-within:shadow-outline"
    >
      <icon name="search" class="w-6 text-purple-1000" />
      <input
        v-model="form.search"
        type="text"
        ref="input"
        class="flex-1 placeholder-purple-500 bg-transparent"
        placeholder="Search for songs or artists..."
      />
      <button @click="form.search = ''" class="text-purple-500 hover:text-purple-800">
        <icon name="circle-x" class="w-6" />
      </button>
    </div>

    <!-- Main Songs List -->
    <main
      class="flex flex-col items-stretch flex-1 mt-12 overflow-hidden select-none sm:flex-row bg-purple-1000"
    >
      <!-- Sidebar -->
      <aside
        class="p-1 m-2 space-y-1 overflow-y-auto text-purple-800 bg-purple-200 rounded-lg max-h-40 sm:max-h-full sm:w-64"
      >
        <h4 class="flex items-center justify-between m-2 mt-1 font-bold">
          <span class="flex items-center space-x-1">
            <icon name="filter" class="w-6 text-purple-500" />
            <span>Artist</span>
          </span>
          <button @click="reset('artist')">
            <icon name="circle-x" class="w-6 text-purple-900" />
          </button>
        </h4>
        <ul class="space-y-1">
          <li
            v-for="artist in artists"
            :key="artist.id"
            @click="form.artist = artist.id"
            class="flex items-center p-2 transition bg-purple-100 rounded cursor-pointer hover:bg-white"
            :class="[form.artist == artist.id ? 'font-bold text-purple-1000' : 'text-purple-600']"
          >{{ artist.name }}</li>
        </ul>
        <h4 class="flex items-center justify-between pt-3 m-2 font-bold">
          <span class="flex items-center space-x-1">
            <icon name="filter" class="w-6 text-purple-500" />
            <span>Genre</span>
          </span>
          <button @click="reset('genre')">
            <icon name="circle-x" class="w-6 text-purple-900" />
          </button>
        </h4>
        <ul class="space-y-1">
          <li
            v-for="genre in genres"
            :key="genre.id"
            @click="form.genre = genre.id"
            class="flex items-center p-2 transition bg-purple-100 rounded cursor-pointer hover:bg-white"
            :class="[form.genre == genre.id ? 'font-bold text-purple-1000' : 'text-purple-600']"
          >{{ genre.name }}</li>
        </ul>
      </aside>
      <!-- Songs -->
      <ul class="flex-1 max-h-full py-2 space-y-1 overflow-y-auto sm:ml-0">
        <transition-group v-if="Object.keys(songs).length" name="list" appear>
          <song-item
            v-for="song in songs"
            :key="song.id"
            :song="song"
            dark
            @add-to-playlist="showPlaylists"
          />
        </transition-group>
        <p
          v-else
          class="flex items-center justify-center h-full text-purple-500"
          key="no-results"
        >No results matching your search</p>
        <playlist-selector-popup :show.sync="playlistsPopup.show" :songId="playlistsPopup.songId" />
      </ul>
    </main>
  </div>
</template>

<script>
import Avatar from "@/components/ui/Avatar";
import PlaylistSelectorPopup from "@/components/ui/PlaylistSelectorPopup";
import throttle from "lodash/throttle";
import SongItem from "@/components/ui/SongItem";
import addToPlaylist from "@/mixins/addToPlaylist";
import pickBy from "lodash/pickBy";
import keyBy from "lodash/keyBy";
import { mapState } from "vuex";
import axios from "axios";
import { timestamp } from "@/helpers/filters";

export default {
  name: "Home",
  components: { Avatar, SongItem, PlaylistSelectorPopup },
  mixins: [addToPlaylist],
  data() {
    return {
      form: {
        search: "",
        artist: "",
        genre: "",
      },
    };
  },
  computed: {
    ...mapState(["songs", "artists", "genres"]),
  },
  watch: {
    form: {
      handler: throttle(function () {
        let query = pickBy(this.form);
        // TODO: handle search / filters
      }, 150),
      deep: true,
    },
  },
  methods: {
    reset(prop) {
      this.form[prop] = null;
    },
  },
  filters: { timestamp },
  async mounted() {
    this.$refs.input.focus();

    if (!this.songs.length) {
      const songs = await this.$http.get("/songs");
      const artists = await this.$http.get("/artists");
      console.log(songs, keyBy(artists.data, "id"));

      this.$store.commit("SET_SONGS", keyBy(songs.data, "id"));
      this.$store.commit("SET_ARTISTS", keyBy(artists.data, "id"));
    }
  },
};
</script>
