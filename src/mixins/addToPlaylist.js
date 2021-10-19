export default {
  data() {
    return {
      playlistsPopup: {
        show: false,
        songId: 0
      }
    };
  },
  methods: {
    showPlaylists(songId) {
      this.playlistsPopup.show = true;
      this.playlistsPopup.songId = songId;
    }
  }
};
