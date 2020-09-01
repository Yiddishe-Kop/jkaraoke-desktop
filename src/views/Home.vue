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
        v-model="filters.search"
        type="text"
        ref="input"
        class="flex-1 placeholder-purple-500 bg-transparent"
        placeholder="Search for songs or artists..."
      />
      <button @click="filters.search = ''" class="text-purple-500 hover:text-purple-800">
        <icon name="circle-x" class="w-6" />
      </button>
    </div>

    <!-- Main Songs List -->
    <main
      class="flex flex-col items-stretch flex-1 mt-12 overflow-hidden select-none sm:flex-row bg-purple-1000"
    >
      <!-- Sidebar -->
      <aside
        class="p-1 m-2 space-y-1 overflow-y-auto text-purple-800 bg-purple-200 max-h-40 sm:max-h-full sm:w-64"
      >
        <div class="mx-2 mt-3 mb-5">
          <p class="text-sm">Show only:</p>
          <div class="flex items-center space-x-4">
            <span>
              <input v-model="filters.offline" type="checkbox" id="offline" class="form-checkbox" />
              <label for="offline" class="ml-1">Saved offline</label>
            </span>
            <span v-if="!$store.state.auth.billing.subscribed">
              <input
                v-model="filters.purchased"
                type="checkbox"
                id="purchased"
                class="form-checkbox"
              />
              <label for="purchased" class="ml-1">My songs</label>
            </span>
          </div>
        </div>
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
            @click="filters.artist = artist.id"
            class="flex items-center p-2 transition rounded cursor-pointer"
            :class="[filters.artist == artist.id ? 'bg-purple-700 font-bold hover:bg-purple-600 text-purple-100' : 'bg-purple-100 hover:bg-white text-purple-600']"
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
            @click="filters.genre = genre.id"
            class="flex items-center p-2 transition rounded cursor-pointer"
            :class="[filters.genre == genre.id ? 'bg-purple-700 font-bold hover:bg-purple-600 text-purple-100' : 'bg-purple-100 hover:bg-white text-purple-600']"
          >{{ genre.name }}</li>
        </ul>
      </aside>
      <!-- Songs -->
      <ul class="flex-1 max-h-full px-2 py-2 space-y-1 overflow-y-auto sm:pl-0 sm:ml-0">
        <transition-group v-if="Object.keys(filteredSongs).length" name="list" appear>
          <song-item
            v-for="song in filteredSongs"
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
import Avatar from '@/components/ui/Avatar';
import PlaylistSelectorPopup from '@/components/ui/PlaylistSelectorPopup';
import SongItem from '@/components/ui/SongItem';
import addToPlaylist from '@/mixins/addToPlaylist';
import { mapState } from 'vuex';
import axios from 'axios';
import { timestamp } from '@/helpers/filters';

export default {
  name: 'Home',
  components: { Avatar, SongItem, PlaylistSelectorPopup },
  mixins: [addToPlaylist],
  data() {
    return {
      filters: {
        search: '',
        artist: '',
        genre: '',
        offline: false,
        purchased: false,
      },
    };
  },
  computed: {
    ...mapState(['songs', 'artists', 'genres']),
    filteredSongs() {
      return Object.values(this.songs)
        .filter((song) => {
          if (this.filters.artist) {
            return song.artist.id == this.filters.artist;
          }
          return true;
        })
        .filter((song) => {
          if (this.filters.genre) {
            return song.genres.some((id) => id == this.filters.genre);
          }
          return true;
        })
        .filter((song) => {
          if (/\S/.test(this.filters.search)) {
            return (
              !!song.title.match(new RegExp(this.filters.search, 'i')) ||
              !!song.artist.name.match(new RegExp(this.filters.search, 'i'))
            );
          }
          return true;
        })
        .filter((song) => {
          if (this.filters.offline) {
            return this.$store.state.downloads[song.id];
          }
          return true;
        })
        .filter((song) => {
          if (this.filters.purchased) {
            return this.$store.state.auth.billing.purchasedSongs.some((i) => i == song.id);
          }
          return true;
        });
    },
  },
  methods: {
    reset(prop) {
      this.filters[prop] = null;
    },
  },
  filters: { timestamp },
  async mounted() {
    this.$refs.input.focus();
    // refresh user data - billing, purchases etc.
    this.$store.dispatch('getUserData');

    setTimeout(() => {
      if (!Object.keys(this.songs).length) {
        console.log('Load songs!');
        // TODO: pereodically check subscription status
        this.$store.dispatch('updateLocalData');
      }
    }, 200);
  },
};
</script>
