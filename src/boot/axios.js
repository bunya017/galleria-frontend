import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api'
})

export default async ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}
