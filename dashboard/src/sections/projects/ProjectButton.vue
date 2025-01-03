<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { RouterLink } from 'vue-router'
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
  <RouterLink :to="'/projects/' + project.id">
    <div class="project panel">
      <p class="new hint">
        {{ GetNewEntryCount(project) }} new
        {{ GetNewEntryCount(project) === 1 ? 'entry' : 'entries' }} since last visit
      </p>
      <header class="header">
        <div class="main">
          <Icon :icon="'circle-flags:' + project.original_language?.code" />
          <h4>{{ project.title }}</h4>
          <p class="hint">by {{ project.owner?.username }}</p>
        </div>
        <Icon icon="solar:menu-dots-bold" class="menu-button" />
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
          <p class="contributors">
            <Icon icon="solar:users-group-rounded-bold" />{{ project.contributors?.length }}
          </p>
          <p class="entries"><Icon icon="solar:notes-bold" />{{ project.entries?.length }}</p>
        </div>
      </div>

      <!-- <h3>{{ props.project.name }}</h3>
    <p>{{ props.project.description }}</p> -->
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.project {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: var(--transition);
  &:hover {
    border-color: var(--theme);
    .languages {
      gap: 0.5rem;
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
      rotate: 90deg;
      transition: var(--transition);
      font-size: 100%;
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
