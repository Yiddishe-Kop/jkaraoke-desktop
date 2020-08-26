import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState } from "vuex-electron"
import axios from '../helpers/axios';
import keyBy from "lodash/keyBy";
import router from '../router';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      user: null,
      billing: {}
    },
    songs: {},
    artists: {},
    genres: {},

    downloads: {},

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
    SET_USER(state, user) {
      state.auth.user = user
    },
    SET_BILLING(state, billing) {
      state.auth.billing = billing
    },
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
    async getUserData(context) {
      const res = await axios.get("/auth/billing");
      console.log(res);
      context.commit("SET_USER", res.data.user);

      delete res.data.user
      context.commit("SET_BILLING", res.data);
    },
    async updateLocalData(context) {
      const songs = await axios.get("/songs");
      const artists = await axios.get("/artists");
      const genres = await axios.get("/genres");

      context.commit("SET_SONGS", keyBy(songs.data, "id"));
      context.commit("SET_ARTISTS", keyBy(artists.data, "id"));
      context.commit("SET_GENRES", keyBy(genres.data, "id"));
    },
    async logout(context) {
      const res = await axios.post("/auth/logout");
      context.commit("SET_USER", null);
      context.commit("SET_BILLING", null);
      localStorage.setItem("token", '');
      router.push({ name: "Login" });
    },
  },
  modules: {
  },
  plugins: [
    createPersistedState(),
  ],
})
