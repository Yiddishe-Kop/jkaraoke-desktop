<template>
  <div class="relative flex items-center justify-center h-full" style="line-height: 1.25;">
    <audio-visualizer
      :audio="audio"
      :lyric="currentLyric"
      :animation-percentage="animationPercentage"
      @show-next="showNextLyric"
    />
    <span v-show="hasLyricInFuture" ref="lyrics" class="relative z-10">
      <div v-for="lyric in currentLyricsGroup" :key="lyric.index" class="flex justify-center">
        <swiping-lyric
          v-if="lyric.text !== 'countdown' && currentLyric.text !== 'countdown'"
          :lyric="lyric"
          :transition="transition"
          :animation-percentage="
            lyric.text !== 'countdown' && lyric.index == currentLyric.index
              ? animationPercentage
              : lyric.start < time
              ? 0
              : 100
          "
        />
      </div>
    </span>
    <div ref="controls" class="fixed bottom-0 left-0 right-0 md:px-6 md:pb-6">
      <transition name="slideUp" appear>
        <audio-player
          :song="song"
          @play="transition = '0.2s linear'"
          @pause="transition = 'none'"
          class="max-w-4xl mx-auto"
          ref="audio"
          :show-popup.sync="showPopup"
          :tab.sync="tab"
        />
      </transition>
    </div>
    <popup v-show="showPopup" :show-popup.sync="showPopup" :tab.sync="tab" />
  </div>
</template>

<script>
import SwipingLyric from '@/components/SwipingLyric';
import AudioPlayer from '@/components/AudioPlayer';
import Popup from '@/components/Popup';
import AudioVisualizer from '@/components/AudioVisualizer';

export default {
  name: 'PlayerPage',
  components: { SwipingLyric, AudioPlayer, AudioVisualizer, Popup },
  data() {
    return {
      audio: undefined,
      timeline: [],
      timelineArr: [],
      showLyricIndex: 0,
      transition: 'none',
      showPopup: false,
      tab: 'search',
    };
  },
  computed: {
    song() {
      return this.$store.state.songs[this.songId || this.$route.params.id];
    },
    time() {
      if (!this.audio) return 0;
      return this.audio.time;
    },
    currentLyricsGroup() {
      let group;
      this.timeline.forEach((g) => {
        let withinCurrentTime = g[0].start < this.time && g[g.length - 1].end > this.time;
        if (withinCurrentTime) group = g;
      });
      return group || [];
    },
    currentLyric() {
      const placeholder = { index: undefined, start: 0, end: 0, text: '' };
      let current = placeholder;
      current = this.currentLyricsGroup.find((l) => l.start < this.time && l.end > this.time) || placeholder;
      return current;
    },
    animationPercentage() {
      const currentLyric = this.currentLyric;
      if (typeof currentLyric.start != 'number' || currentLyric.index === undefined) return {};
      const start = currentLyric.pauseStart ? currentLyric.start + 1 : currentLyric.start;
      const length = currentLyric.end - start;
      let normalizedCurrentTime = this.time - start;
      return 100 - (normalizedCurrentTime / length) * 100;
    },
    hasLyricInFuture() {
      return !!this.currentLyricsGroup.find((l) => l.text != 'countdown' && l.end > this.time);
    },
  },
  methods: {
    resizeLyrics() {
      const lyricsEl = this.$refs.lyrics;
      let lyricsWidth = 0;
      let lyricsHeight = 0;
      const songTitleHeight = 24;
      const controlsHeight = this.$refs.controls.clientHeight + songTitleHeight;
      const availableHeight = this.$el.clientHeight - controlsHeight;
      let percentageToScaleDownX = 1;
      let percentageToScaleDownY = 1;
      if (this.currentLyricsGroup.length) {
        lyricsWidth = lyricsEl.scrollWidth;
        lyricsHeight = lyricsEl.scrollHeight;
      }
      if (lyricsWidth > window.innerWidth) {
        percentageToScaleDownX = window.innerWidth / lyricsWidth - 0.015;
      }
      if (lyricsHeight > availableHeight) {
        percentageToScaleDownY = availableHeight / lyricsHeight;
      }
      lyricsEl.style.transform = `scale(${Math.min(percentageToScaleDownY, percentageToScaleDownX)})`;
      this.$el.style.paddingBottom = `${controlsHeight}px`;
    },
    structureTimeline() {
      let timeline = {};
      this.song.lyrics.forEach((l, i) => {
        let prevLyric = this.song.lyrics[i - 1];
        if (i == 0) {
          // first lyric
          // always add a full countdown at beginning of song
          timeline[0] = {
            text: 'countdown',
            start: 0,
            end: l.start - 1,
          };
          l.start -= 1;
          l.pauseStart = true;
        } else {
          // not first lyric
          if (l.start >= prevLyric.end + 5) {
            // more than 5s empty before this lyric
            // show countdown
            let countdownStart = prevLyric.end + 1;
            timeline[countdownStart] = {
              text: 'countdown',
              start: countdownStart,
              end: l.start - 1,
            };
            l.start -= 1;
            l.pauseStart = true;
          }
        }
        timeline[l.start] = { ...l }; // add current lyric
      });
      this.timelineArr = Object.values(timeline)
        .sort((a, b) => a.start - b.start) // sort by time
        .map((l, i) => {
          l.index = i;
          return l;
        });

      const previousLyric = (index) => {
        let prev = this.timelineArr[index - 1];
        while (prev.text == 'countdown' && prev.index > 0) {
          prev = this.timelineArr[prev.index - 1];
        }
        return prev;
      };

      let chunks = [];
      let chunk = [];
      this.timelineArr.forEach((l, i) => {
        if (i === 0) {
          chunk.push(l);
        } else {
          if (chunk.filter((j) => j.text !== 'countdown').length < 4 && previousLyric(i).end > l.start - 5) {
            chunk.push(l);
          } else {
            chunks.push(chunk);
            chunk = [l];
          }
        }
      });
      chunk.length && chunks.push(chunk);
      this.timeline = chunks;
    },
    showNextLyric(i) {
      console.log(i);
      this.showLyricIndex = i;
    },
  },
  updated() {
    this.resizeLyrics();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeLyrics);
  },
  mounted() {
    this.audio = this.$refs.audio;
    this.structureTimeline();
    window.addEventListener('resize', this.resizeLyrics);
  },
};
</script>

<style>
</style>
