import axios, { type AxiosInstance } from 'axios'
import qs from 'qs'

const ApiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'comma' })
  },
})

export default abstract class BaseService {
  protected url: string
  protected ApiClient: AxiosInstance

  constructor(url: string) {
    this.url = url
    this.ApiClient = ApiClient
  }
}
