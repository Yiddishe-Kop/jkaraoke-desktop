<template>
  <div class="fixed inset-0 pointer-events-none">
    <div class="absolute inset-0 bg-purple-gradient"></div>
    <div
      class="absolute inset-0"
      style="background-color: var(--bg-color, #351884); opacity: var(--bg-opacity); transition: all 0.7s ease-in;"
    ></div>
    <div ref="scene" class="absolute inset-0"></div>
  </div>
</template>

<script>
import ThreeDvizualizer from '@/helpers/3Dvisualizer';
let ThreeD;

export default {
  name: 'AudioVisualizer',
  props: ['audio', 'lyric', 'animationPercentage'],
  data() {
    return {
      ThreeD: undefined,
    };
  },
  methods: {},
  computed: {
    text() {
      if (this.lyric.text != 'countdown') {
        document.documentElement.style.setProperty('--bg-color', '#ca81ec');
        document.documentElement.style.setProperty('--bg-opacity', 0);
        return false;
      }
      const currentSecond = Math.floor(((this.lyric.end - this.lyric.start) * this.animationPercentage) / 100);
      if (currentSecond === 0) {
        this.$emit('show-next', this.lyric.index + 1);
      }
      const colors = ['#bf0603', '#D20023', '#FB5607', '#FFBE0B', '#E85C90'];
      if (currentSecond < colors.length) {
        document.documentElement.style.setProperty('--bg-color', colors[currentSecond]);
        document.documentElement.style.setProperty('--bg-opacity', 0.35);
      }
      return String(currentSecond);
    },
  },
  watch: {
    text(newText) {
      ThreeD.text = newText ? newText : '';
    },
  },
  async mounted() {
    await this.$nextTick();
    ThreeD = new ThreeDvizualizer(this.audio.$refs.audio, this.$refs.scene);
    ThreeD.init();
    window.addEventListener('resize', ThreeD.onWindowResize, false);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', ThreeD.onWindowResize, false);
    });
  },
};
</script>

<style>
</style>
