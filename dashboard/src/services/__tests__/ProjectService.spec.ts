import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { new_project, projects } from '@/assets/testing/test-projects'
import ProjectService from '../ProjectService'

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
      })),
    },
  }
})

describe('ProjectService', () => {
  let mock_get: any
  let mock_post: any
  let mock_delete: any

  beforeEach(() => {
    mock_get = vi.spyOn(ProjectService['ApiClient'], 'get')
    mock_post = vi.spyOn(ProjectService['ApiClient'], 'post')
    mock_delete = vi.spyOn(ProjectService['ApiClient'], 'delete')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches all projects', async () => {
    mock_get.mockResolvedValueOnce(projects)
    const result = await ProjectService.GetProjects()
    expect(result).toEqual(projects)
  })

  it('fetches one project', async () => {
    mock_get.mockResolvedValueOnce(projects[0])
    const result = await ProjectService.GetProject(1)
    expect(result).toEqual(projects[0])
  })

  it('creates a project', async () => {
    mock_post.mockResolvedValueOnce({ id: 1 })
    const result = await ProjectService.CreateProject(new_project)
    expect(result).toEqual({ id: 1 })
  })

  it('leaves a project', async () => {
    mock_delete.mockResolvedValueOnce(true)
    const result = await ProjectService.LeaveProject(1)
    expect(result).toEqual(true)
  })
})
