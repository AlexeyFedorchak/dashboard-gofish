import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
  // headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem(('token')))[0]}` },
})
// axiosIns.defaults.headers.get.Authorization = `Bearer${JSON.parse(localStorage.getItem(('token')))[0]}`

Vue.prototype.$http = axiosIns

export default axiosIns
