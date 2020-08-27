<template>
  <div>
    <audio
      ref="audio"
      src="blabla"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="time = $event.target.currentTime"
      @canplay="startPlaying"
      @error="showErrorMessage"
      @loadedmetadata="setDuration"
      @ended="playNext"
      crossorigin="anonymous"
    ></audio>

    <div
      class="relative flex items-center justify-between p-1 pt-3 bg-purple-100 shadow-2xl md:p-2 rounded-t-xl md:rounded-xl"
    >
      <div class="absolute top-0 left-0 right-0 flex justify-center transform -translate-y-5/6">
        <div
          class="flex items-center px-3 py-1 space-x-2 text-xs leading-4 text-purple-100 truncate bg-purple-900 rounded-full shadow-md"
        >
          <icon name="music" class="w-4 -my-1" />
          <span class="font-bold">{{ song.title }}</span>
          <span class="text-purple-300 transition hover:text-white">{{ song.artist.name }}</span>
        </div>
      </div>
      <album-cover
        :image="albumArt"
        :title="song.title"
        :animate="isPlaying"
        class="absolute top-0 left-0 z-50 hidden -mt-7 md:flex md:ml-8"
      />
      <span></span>
      <div class="flex flex-wrap items-center justify-center space-x-3 md:space-x-6">
        <div class="flex items-center space-x-3">
          <button @click="showPlaylistPopup">
            <icon name="list" class="w-6 text-purple-500" />
          </button>
          <button
            @click="togglePlay"
            class="m-1.5 rounded-full transition text-purple-600 hover:text-purple-500"
            :class="{ 'opacity-25': disabled }"
            :disabled="disabled"
          >
            <loader v-if="loading" class="w-12 h-12 -m-1.5" />
            <icon v-else :name="isPlaying ? 'pause' : 'play'" class="w-12 -m-1.5" />
          </button>
          <button @click="audio.muted = !audio.muted">
            <icon
              name="volume"
              class="w-6"
              :class="[audio.muted ? 'text-purple-300' : 'text-purple-800']"
            />
          </button>
        </div>
        <vue-slider
          v-model="time"
          :duration="0.2"
          :height="6"
          :width="200"
          :dot-size="18"
          :dot-options="{
            style: {
              backgroundColor: '#FAF5FF',
              borderColor: '#ca81ec',
            },
            focusStyle: {
              backgroundColor: '#FAF5FF',
              borderColor: '#553C9A',
              boxShadow: '0 0 0 5px #553C9A35',
            },
          }"
          :max="Math.ceil(duration) || 100"
          tooltip="none"
          :process-style="{ backgroundColor: '#ca81ec' }"
          :rail-style="{ backgroundColor: '#cbd5e0' }"
        />
        <span
          v-if="!disabled"
          class="flex flex-wrap items-center justify-center text-xs font-bold text-purple-900"
        >
          <span>{{ time | timestamp }}</span>
          <span class="ml-2 text-gray-600">{{ duration | timestamp }}</span>
          <button @click="toggleFullscreen" class="ml-2 p-0.5 rounded-full">
            <icon
              name="expand"
              class="w-5"
              :class="[isFullscreen ? 'text-purple-700' : 'text-purple-300']"
            />
          </button>
        </span>
        <span v-else-if="errorMessage" class="text-xs text-purple-900">{{ errorMessage }}</span>
      </div>
      <div class="flex items-center mr-3 space-x-2">
        <button
          @click="showSearchPopup"
          class="hidden sm:block p-1.5 bg-purple-200 rounded-full hover:bg-purple-300 transition"
        >
          <icon name="search" class="w-5 text-purple-700" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MediaTags from 'jsmediatags';
import NodeFileReader from 'jsmediatags/build2/NodeFileReader';
import AlbumCover from '@/components/ui/AlbumCover';
import { timestamp } from '@/helpers/filters';
import permissions from '@/mixins/permissions';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import axios from 'axios';
import Path from 'path';
import { getSongsFolderPath } from '@/helpers/paths';

export default {
  props: ['song', 'showPopup', 'tab'],
  components: { AlbumCover, VueSlider },
  mixins: [permissions],
  data() {
    return {
      audio: {}, // ref to <audio>
      albumArt: undefined,
      loading: true,
      time: 0,
      duration: 0,
      isPlaying: false,
      isFullscreen: false,
      disabled: false,
      errorMessage: 'No Audio available',
      expanded: true,
      tracker: {
        interval: undefined,
        durationPlayed: 0,
      },
    };
  },
  methods: {
    handlePlay() {
      this.isPlaying = true;
      this.tracker.interval = setInterval(() => {
        this.tracker.durationPlayed++;
      }, 1000);
    },
    handlePause() {
      this.isPlaying = false;
      clearInterval(this.tracker.interval);
    },
    togglePlay() {
      if (this.loading) return;
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        // catch "not-allowed - no user interaction" error
        window.ThreeDAudioContext.resume();
        this.audio.play();
        this.isPlaying = true;
      }
    },
    setDuration(e) {
      this.duration = this.canPlay ? e.target.duration : 30;
    },
    startPlaying() {
      if (this.loading) {
        this.loading = false;
        this.$refs.audio.play();
      }
    },
    shouldPlayOnline() {
      return !this.$store.state.downloads[this.song.id] && this.$store.state.online;
    },
    updateAudioSrc() {
      this.loading = true;
      let audioSrc, reader;
      if (this.shouldPlayOnline()) {
        audioSrc = `${process.env.VUE_APP_BASE_URL}/api/download/${this.song.id}?play=1&token=${localStorage.getItem(
          'token'
        )}`;
        this.$refs.audio.src = audioSrc;
        reader = new MediaTags.Reader(audioSrc);
      } else {
        audioSrc = Path.resolve(getSongsFolderPath(), String(this.song.id));
        this.$refs.audio.src = 'file://' + audioSrc;
        reader = new MediaTags.Reader(audioSrc);
        reader.setFileReader(NodeFileReader);
      }
      reader.read({
        onSuccess: (tag) => {
          const picture = tag.tags.picture;
          if (!picture) return;
          var base64String = '';
          for (var i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
          }
          this.albumArt = `data:${picture.format};base64,${btoa(base64String)}`;
        },
      });
    },
    showErrorMessage(e) {
      this.loading = false;
      this.disabled = true;
      this.errorMessage = e.target.error.message;
      // this.errorMessage = 'Please log in 😀';
    },
    playNext(e) {
      // if (!this.$page.currentPlaylist) return;
      // const currentPlaylist = this.$page.playlists.find((p) => p.id == Number(this.$page.currentPlaylist));
      // const songs = currentPlaylist.songs;
      // const currentSongIndex = songs.findIndex((s) => s.id == this.song.id);
      // if (currentSongIndex >= songs.length - 1) return;
      // const nextSong = songs[currentSongIndex + 1];
      // this.$inertia.visit(
      //   this.route('music.player', {
      //     song: nextSong.id,
      //     playlist: currentPlaylist.id,
      //   })
      // );
    },
    showSubscribePopup() {
      this.$page.modal = {
        open: true,
        icon: 'music',
        color: 'purple',
        title: '14 Day Free Trial!',
        message: 'Sign up now for full access to all our songs.',
        action: {
          label: false,
          confirm: () => {
            console.log('Trial');
          },
          cancel: () => {},
        },
      };
    },
    showPlaylistPopup() {
      this.$emit('update:tab', 'playlist');
      this.$emit('update:show-popup', true);
    },
    showSearchPopup() {
      this.$emit('update:tab', 'search');
      this.$emit('update:show-popup', true);
    },
    async toggleFullscreen() {
      if (!!document.fullscreenElement) {
        await document.exitFullscreen();
        this.isFullscreen = false;
      } else {
        await document.body.requestFullscreen();
        this.isFullscreen = true;
      }
    },
  },
  filters: {
    timestamp,
  },
  watch: {
    song(newSong) {
      console.log('changed!');
      this.updateAudioSrc();
    },
    isPlaying(playing) {
      this.$emit(playing ? 'play' : 'pause');
    },
    time(time) {
      if (Math.abs(time - this.audio.currentTime) > 0.5) {
        this.audio.currentTime = time;
      }
      if (!this.canPlay && this.time >= 30) {
        // not subscribed
        // server only streams ~40s
        // limit to 30s
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.pause();
        this.showSubscribePopup();
      }
    },
    'tracker.durationPlayed': function (durationPlayed) {
      if (durationPlayed > this.duration * 0.9) {
        if (this.$store.state.online) {
          this.$http
            .post('views', {
              user_id: this.$store.state.auth.user.id,
              song_id: this.song.id,
            })
            .then((res) => console.log(res.data));
        } else {
          this.$store.commit('ADD_VIEW', this.song);
        }
        this.tracker.durationPlayed = 0;
      }
    },
  },
  mounted() {
    this.audio = this.$refs.audio;
    this.updateAudioSrc();
  },
};
</script>
