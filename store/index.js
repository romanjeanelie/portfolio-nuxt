/* eslint-disable */
import { getGPUTier } from 'detect-gpu'
import { groq } from '@nuxtjs/sanity'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'

if (process.browser) {
  var sniffer = require('sniffer')
}

const queryProjects = (commit) => {
  const query = groq`{ "projects": *[_type == 'projects']| order(order asc)}`
  return getAsyncData(query).then((data) => {
    commit('SET', { property: 'allProjects', value: data.projects })
  })
}

const queryAbout = (commit) => {
  const query = groq`{ "about": *[_type == 'about']}`
  return getAsyncData(query).then((data) => {
    commit('SET', { property: 'about', value: data.about })
  })
}

export const state = () => ({
  allWorks: [],
  isMobile: null,
  reducedMotion: false,
})

export const mutations = {
  SET(state, obj) {
    state[obj.property] = obj.value
  },
  CHECK_MOBILE(state) {
    state.isMobile = sniffer && sniffer.isPhone ? true : false
  },
  CHECK_MOTION(state, result) {
    state.reducedMotion = result
  },
}

export const actions = {
  async nuxtServerInit({ commit }) {
    await queryProjects(commit)
    await queryAbout(commit)
  },
  set({ commit }, obj) {
    commit('SET', obj)
  },
  checkMobile({ commit }) {
    commit('CHECK_MOBILE')
  },
  async checkMotion({ commit }) {
    let result = false
    const gpuTier = await getGPUTier()

    if (gpuTier.tier < 3) {
      result = true
    }
    console.log('result', result)
    commit('CHECK_MOTION', result)
  },
}

export const getters = {
  isMobile: (state) => {
    return state.isMobile
  },
  isTouch() {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  },
}
