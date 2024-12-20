import axios from 'axios'

const ApiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default abstract class BaseService {
  protected url: string
  protected ApiClient: axios.AxiosInstance

  constructor(url: string) {
    this.url = url
    this.ApiClient = ApiClient
  }

  parse_follow(follow?: string[]): string {
    return follow ? `follow=${follow.join(',')}` : ''
  }

  parse_filter(filter?: string): string {
    return filter ? `filter=${filter}` : ''
  }
}
