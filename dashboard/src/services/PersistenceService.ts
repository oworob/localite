class PersistenceService {
  Set(key: string, value: any) {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  }

  Get<T>(key: string): T | null {
    const serialized = localStorage.getItem(key)
    if (!serialized) {
      return null
    }
    return JSON.parse(serialized)
  }

  Remove(key: string) {
    localStorage.removeItem(key)
  }

  Clear() {
    localStorage.clear()
  }
}

export default new PersistenceService()
