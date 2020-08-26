<template>
  <button @click.stop="download" class="ml-2">
    <icon
      v-if="!loading"
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
  methods: {
    async download() {
      this.loading = true;

      const res = this.$http
        .get(`/download/${this.song.id}`, {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.total;
            const current = progressEvent.loaded;
            this.progress = Math.floor((current / total) * 100);
          },
        })
        .then(async (res) => {
          const blob = await res.data.text();
          this.saveFile(blob);
        })
        .catch((err) => {});

      this.progress = 0;
      this.loading = false;
      // const blob = await res.blob();
      // console.log(await res.data.text());
      // console.log(new File([res.data], "filename.mp3"));
    },
    async saveFile(blob) {
      const filename = "filename.mp3";
      const userDataPath = (electron.app || electron.remote.app).getPath(
        "userData"
      );
      fse
        .outputFile(`${userDataPath}/songs/${filename}`, blob)
        .then((file) => {
          console.log({ file });
        })
        .catch((err) => {
          console.log({ err });
        });
    },
  },
};
</script>

<style>
</style>
