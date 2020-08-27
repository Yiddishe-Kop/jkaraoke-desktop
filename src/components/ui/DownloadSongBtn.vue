<template>
  <button @click="handleClick">
    <icon
      v-if="isOffline"
      name="check-circle"
      class="w-6 ml-2"
      :class="[dark ? 'text-purple-200' : 'text-purple-600']"
    />
    <icon
      v-else-if="!loading"
      name="download"
      class="w-6"
      :class="[dark ? 'text-purple-200' : 'text-purple-600']"
    />
    <progress-circle v-if="loading" :progress="progress" />
  </button>
</template>

<script>
import ProgressCircle from "@/components/ui/ProgressCircle";
import electron from "electron";
import fse from "fs-extra";
import Fs from "fs";
import Path from "path";
import { mapState } from "vuex";

export default {
  name: "DownloadSongBtn",
  props: ["song", "dark"],
  components: { ProgressCircle },
  data() {
    return {
      loading: false,
      progress: 0,
    };
  },
  computed: {
    ...mapState(["downloads"]),
    isOffline() {
      return this.downloads[this.song.id];
    },
  },
  methods: {
    async handleClick() {
      if (!this.isOffline) {
        this.loading = true;
        this.download()
          .then(() => {
            this.progress = 0;
            this.loading = false;
            this.$store.commit("ADD_DOWNLOAD", this.song);
          })
          .catch((err) => {
            this.progress = 0;
            this.loading = false;
            console.log(err);
          });
      } else {
        this.removeDownload();
      }
    },
    async download() {
      const filename = `${this.song.id}`;

      const writer = Fs.createWriteStream(
        Path.resolve(this.getSongsFolderPath(), filename)
      );

      const response = await this.$http.get(`/download/${this.song.id}`, {
        responseType: "stream",
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const current = progressEvent.loaded;
          this.progress = Math.floor((current / total) * 100);
        },
      });

      response.data.pipe(writer);
      console.log(response);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("pipe", () => console.log("piping"));
        writer.on("error", reject);
      });
    },
    removeDownload() {
      Fs.unlink(
        Path.resolve(this.getSongsFolderPath(), String(this.song.id)),
        () => {
          this.$store.commit("REMOVE_DOWNLOAD", this.song);
        }
      );
    },
    getSongsFolderPath() {
      const userDataPath = (electron.app || electron.remote.app).getPath(
        "userData"
      );
      const songsFolder = Path.resolve(userDataPath, "songs");
      if (!Fs.existsSync(songsFolder)) {
        Fs.mkdirSync(songsFolder);
      }
      return songsFolder;
    },
  },
};
</script>

<style>
</style>
