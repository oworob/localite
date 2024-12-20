// todo:
// save selected language and entry for each project
// save unsubmitted translation for each entry
// save collapsed project notes for each project

import type { IProjectSettings } from '@/models/system/persistence'

class PersistenceService {
  Set(key: string, value: any) {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (err) {
      console.error(err)
    }
  }

  Get<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(key)
      if (!serialized) {
        return null
      }
      return JSON.parse(serialized)
    } catch (err) {
      console.error(err)
      return null
    }
  }

  Remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.error(err)
    }
  }

  Clear() {
    try {
      localStorage.clear()
    } catch (err) {
      console.error(err)
    }
  }

  GetProjectSettings(id: number): IProjectSettings | null {
    return this.Get(`project-${id}`)
  }

  SetProjectSettings(id: number, settings: IProjectSettings) {
    this.Set(`project-${id}`, settings)
  }
}

export default new PersistenceService()
