import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      user: null
    },
    songs: {},
    artists: {},
    genres: {},

    modal: {
      open: false,
      icon: 'warning',
      color: 'red',
      title: 'jKaraoke',
      message: '',
      action: {
        label: 'Hey!',
      }
    },
  },
  mutations: {
    SET_SONGS(state, songs) {
      state.songs = songs
    },
    SET_ARTISTS(state, artists) {
      state.artists = artists
    }
  },
  actions: {
  },
  modules: {
  }
})
