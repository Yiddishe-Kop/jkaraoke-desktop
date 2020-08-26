export default {
  methods: {
    canPlay(song) {
      const user = this.$store.state.auth.user
      const billing = this.$store.state.auth.billing
      return billing.subscribed || billing.purchasedSongs.some(id => song.id == id)
    }
  }
}
