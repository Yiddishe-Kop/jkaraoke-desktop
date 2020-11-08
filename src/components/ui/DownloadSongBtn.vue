<template>
  <button @click="handleClick" @mouseenter="offlineIcon = 'trash'" @mouseleave="offlineIcon = 'check-circle'">
    <icon v-if="isOffline" :name="offlineIcon" class="w-6" :class="[dark ? 'text-purple-200' : 'text-purple-600']" />
    <icon v-else-if="!loading" name="download" class="w-6" :class="[dark ? 'text-purple-200' : 'text-purple-600']" />
    <progress-circle v-if="loading" :progress="progress" :size="28" />
  </button>
</template>

<script>
import ProgressCircle from '@/components/ui/ProgressCircle';
import Fs from 'fs';
import Path from 'path';
import { mapState } from 'vuex';
import { getSongsFolderPath } from '@/helpers/paths';
import permissions from '@/mixins/permissions';

export default {
  name: 'DownloadSongBtn',
  props: ['song', 'dark'],
  components: { ProgressCircle },
  mixins: [permissions],
  data() {
    return {
      loading: false,
      progress: 0,
      offlineIcon: 'check-circle',
    };
  },
  computed: {
    ...mapState(['downloads']),
    isOffline() {
      return this.downloads[this.song.id];
    },
  },
  methods: {
    async handleClick() {
      if (!this.$store.state.online || !this.canPlay(this.song)) return;
      if (!this.isOffline) {
        this.loading = true;
        this.download()
          .then(() => {
            this.progress = 0;
            this.loading = false;
            this.$store.commit('ADD_DOWNLOAD', this.song);
          })
          .catch((err) => {
            this.progress = 0;
            this.loading = false;
            console.log(err);
          });
      } else {
        this.$store.dispatch('removeDownload', this.song);
      }
    },
    async download() {
      const filename = `${this.song.id}`;

      const writer = Fs.createWriteStream(Path.resolve(getSongsFolderPath(), filename));

      const response = await this.$http.get(`/download/${this.song.id}`, {
        responseType: 'stream',
      });

      const total = response.headers['content-length'];
      let current = 0;
      response.data.on('data', (chunk) => {
        current += chunk.length;
        this.progress = Math.floor((current / total) * 100);
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('pipe', () => console.log('piping'));
        writer.on('error', reject);
      });
    },
  },
};
</script>

<style>
</style>
