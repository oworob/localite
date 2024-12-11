import ApiClient from './ApiClient'

export default abstract class BaseService {
  protected url: string

  constructor(url: string) {
    this.url = url
  }

  get_all<T>(follow?: string[]): Promise<T> {
    const follow_str = follow ? `?follow=${follow.join(',')}` : ''
    return ApiClient.get(`${this.url}${follow_str}`)
  }

  get_one<T>(id: number, follow?: string[]): Promise<T> {
    const follow_str = follow ? `?follow=${follow.join(',')}` : ''
    return ApiClient.get(`${this.url}/${id}${follow_str}`)
  }
}
