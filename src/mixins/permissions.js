export default {
  methods: {
    canPlay(song) {
      const billing = this.$store.state.auth.billing;
      return billing.subscribed || billing.purchasedSongs.some(id => song.id == id);
    }
  }
};
