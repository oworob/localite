<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { RouterLink } from 'vue-router'
import { ICONS } from '@/assets/icons'
import type { IApiProject } from '@/models/project/project'
import { useAuthStore } from '@/stores/AuthStore'

const AuthStore = useAuthStore()

function GetNewEntryCount(project: IApiProject): number {
  const user = project.contributors?.find((contributor) => contributor.id === AuthStore.user?.id)
  const new_entries = project.entries?.filter((entry) => {
    const visit_date = new Date(user!.last_project_visit!)
    const entry_date = new Date(entry.created_at)
    return entry_date > visit_date
  })
  return new_entries!.length
}

const props = defineProps<{
  project: IApiProject
}>()
</script>

<template>
  <RouterLink :to="'/projects/' + project.id" class="project-link">
    <div class="project panel hover">
      <p class="new hint" v-if="GetNewEntryCount(project) > 0">
        {{ GetNewEntryCount(project) }} new
        {{ GetNewEntryCount(project) === 1 ? 'entry' : 'entries' }} since last visit
      </p>
      <header class="header">
        <div class="main">
          <Icon :icon="'circle-flags:' + project.source_language?.code" />
          <h4>{{ project.title }}</h4>
          <p class="hint">by {{ project.owner?.username }}</p>
        </div>
      </header>
      <p class="hint">{{ project.description }}</p>

      <div class="info">
        <div class="languages">
          <Icon
            v-for="language in project.languages"
            :key="language.id"
            :icon="'circle-flags:' + language.code"
          />
        </div>
        <div class="other hint">
          <p class="contributors"><Icon :icon="ICONS.users" />{{ project.contributors?.length }}</p>
          <p class="entries"><Icon :icon="ICONS.entry" />{{ project.entries?.length }}</p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.project-link {
  width: 100%;
}
.project {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: var(--transition);
  &:hover {
    .languages {
      gap: 0.4rem;
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .main {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .menu-button {
      transition: var(--transition);
      font-size: 1rem;
      &:hover {
        color: var(--theme);
      }
    }
  }
  .info {
    display: flex;
    justify-content: space-between;

    .contributors,
    .entries {
      display: flex;
      align-items: center;
      align-self: flex-start;
      gap: 0.25rem;
    }
    .other {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  .languages {
    display: flex;
    flex-wrap: wrap;
    transition: var(--transition);
    gap: 0;
    svg:not(:first-child) {
      margin-left: -0.25rem;
    }
  }
}

a {
  text-decoration: none;
  color: var(--text);
}
</style>
