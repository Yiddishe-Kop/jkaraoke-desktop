<template>
  <li
    class="flex items-center p-2 text-purple-400 transition rounded-md"
    :class="[dark ? 'hover:bg-purple-900' : 'hover:bg-purple-200']"
  >
    <div class="flex flex-col flex-1 truncate">
      <router-link
        :to="{ name: 'Player', params: { id: song.id }}"
        class="font-semibold"
        :class="[dark ? 'text-white' : 'text-purple-800']"
      >{{ song.title }}</router-link>
      <span
        class="mt-1 text-sm text-left"
        :class="[dark ? 'hover:text-purple-200' : 'hover:text-purple-800']"
      >{{ song.artist ? song.artist.name : 'Unknown Artist' }}</span>
    </div>
    <span
      class="mx-4 text-sm font-semibold leading-none"
      :class="[dark ? 'text-purple-200' : 'text-purple-600']"
    >{{ song.duration | timestamp }}</span>
    <router-link :to="{ name: 'Player', params: { id: song.id }}" class="mx-1">
      <icon name="play" class="w-6" :class="[brand.text]" />
    </router-link>
  </li>
</template>

<script>
import { timestamp } from "@/helpers/filters";

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
  filters: { timestamp },
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
