import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.GALLERIA_API
})

Vue.prototype.$axios = axiosInstance

export { axiosInstance }
