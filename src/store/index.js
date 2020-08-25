import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState } from "vuex-electron"
import axios from '../helpers/axios';
import keyBy from "lodash/keyBy";

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
    },
    SET_GENRES(state, genres) {
      state.genres = genres
    }
  },
  actions: {
    async updateLocalData(context) {
      const songs = await axios.get("/songs");
      const artists = await axios.get("/artists");
      const genres = await axios.get("/genres");

      context.commit("SET_SONGS", keyBy(songs.data, "id"));
      context.commit("SET_ARTISTS", keyBy(artists.data, "id"));
      context.commit("SET_GENRES", keyBy(genres.data, "id"));
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState(),
  ],
})
