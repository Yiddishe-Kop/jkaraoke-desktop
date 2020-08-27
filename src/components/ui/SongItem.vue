<template>
  <li
    class="flex items-center p-2 text-purple-400 transition rounded-md"
    :class="[dark ? 'hover:bg-purple-900' : 'hover:bg-purple-200']"
  >
    <router-link
      :to="canPlay(song) ? { name: 'Player', params: { id: song.id }} : { name: 'Home' }"
      class="flex flex-col flex-1 truncate"
    >
      <span
        class="font-semibold"
        :class="[dark ? 'text-white' : 'text-purple-800']"
      >{{ song.title }}</span>
      <span
        class="mt-1 text-sm text-left"
        :class="[dark ? 'hover:text-purple-200' : 'hover:text-purple-800']"
      >{{ song.artist ? song.artist.name : 'Unknown Artist' }}</span>
    </router-link>
    <span
      class="mx-4 text-sm font-semibold leading-none"
      :class="[dark ? 'text-purple-200' : 'text-purple-600']"
    >{{ song.duration | timestamp }}</span>

    <download-button :song="song" :dark="dark" class="ml-2" />
    <router-link
      :to="canPlay(song) ? { name: 'Player', params: { id: song.id }} : { name: 'Home' }"
      class="ml-4"
    >
      <icon name="play" class="w-6" :class="[brand.text]" />
    </router-link>
  </li>
</template>

<script>
import DownloadButton from "@/components/ui/DownloadSongBtn";
import { timestamp } from "@/helpers/filters";
import permissions from "@/mixins/permissions";

export default {
  name: "SongItem",
  props: {
    song: {
      type: Object,
      default: {},
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  components: { DownloadButton },
  filters: { timestamp },
  mixins: [permissions],
  data() {
    return {
      brand: {
        bg: this.dark ? "bg-brand" : "bg-purple-1000",
        text: this.dark ? "text-brand" : "text-purple-1000",
      },
    };
  },
};
</script>

<style>
</style>
