<template>
  <h1
    class="relative overflow-hidden font-extrabold whitespace-no-wrap"
    :class="[isAnimating || animationPercentage == 100 ? 'text-brand' : 'text-white', fontSize]"
  >
    {{ lyric.text }}
    <span
      v-if="isAnimating"
      class="absolute bottom-0 left-0 block overflow-hidden"
      :style="`transform: translate3d(${rtl ? '' : '-'}${easedPercentage}%, 0px, 0px); transition: ${transition}`"
    >
      <span
        class="block w-full h-full text-white"
        :style="`transform: translate3d(${rtl ? '-' : ''}${easedPercentage}%, 0px, 0px); transition: ${transition}`"
      >
        {{ lyric.text }}
      </span>
    </span>
  </h1>
</template>

<script>
export default {
  name: 'SwipingLyric',
  props: {
    lyric: {
      type: Object,
      default: () => ({
        index: 0,
        text: '',
      }),
    },
    transition: {
      type: String,
      default: 'none',
    },
    animationPercentage: {
      type: Number,
      default: 0,
    },
    fontSize: {
      type: String,
      default: 'text-7xl',
    },
  },
  computed: {
    isAnimating() {
      return this.animationPercentage != 0 && this.animationPercentage != 100;
    },
    easedPercentage() {
      // Quadratic InOut
      let t = Math.min(99, this.animationPercentage) * 0.01;
      if ((t *= 2) < 1) {
        return 0.5 * t * t * 100;
      }
      return -0.5 * (--t * (t - 2) - 1) * 100;
    },
    rtl() {
      return /[א-ת]/.test(this.lyric.text);
    },
  },
};
</script>

<style>
</style>
