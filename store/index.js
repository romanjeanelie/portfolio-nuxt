import { groq } from '@nuxtjs/sanity'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'

export const state = () => ({
  allWorks: [],
})

export const mutations = {
  SET(state, obj) {
    state[obj.property] = obj.value
  },
}

export const actions = {
  nuxtServerInit({ context, commit }) {
    const query = groq`{ "projects": *[_type == 'projects']| order(order asc)}`
    return getAsyncData(query).then((data) => {
      commit('SET', { property: 'allProjects', value: data.projects })
    })
  },
}

export const getters = {
  isTouch() {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  },
}
