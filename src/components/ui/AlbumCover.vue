<template>
  <div
    class="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full md:w-20 md:h-20 album-cover"
    :class="{ paused: !animate, 'border-4 border-brand': !image }"
  >
    <img v-if="image" :src="image" :alt="title" class="w-full h-full rounded-full" />
    <p v-else class="text-4xl font-bold leading-none tracking-wider text-white md:text-5xl">{{ initials(title) }}</p>
    <span
      class="absolute inset-0 bg-purple-100 rounded-full shadow-inner"
      :class="{ 'border-4 border-brand m-6': !image, 'm-7': image }"
    ></span>
  </div>
</template>

<script>
export default {
  name: 'AlbumCover',
  props: {
    image: [String, undefined],
    title: String,
    animate: Boolean,
  },
  methods: {
    initials(name) {
      return name
        .split(' ')
        .slice(0, 2)
        .reduce((acc, val) => {
          if (val) {
            return (acc += val[0]);
          } else {
            return acc;
          }
        }, '');
    },
  },
};
</script>

<style>
</style>
