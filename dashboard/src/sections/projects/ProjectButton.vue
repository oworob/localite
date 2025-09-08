<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { RouterLink } from 'vue-router'
import { ICONS } from '@/assets/icons'
import type { IApiProject } from '@/models/project/project'
import { useAuthStore } from '@/stores/AuthStore'
import { FormatDate } from '@/tools/FormatDate'

const AuthStore = useAuthStore()

const props = defineProps<{
  project: IApiProject
}>()
</script>

<template>
  <RouterLink :to="'/projects/' + project.id" class="project-link">
    <div class="project panel hover">
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
          <p class="contributors"><Icon :icon="ICONS.users" />{{ project.stats!.contributors }}</p>
          <p class="entries"><Icon :icon="ICONS.entry" />{{ project.stats!.entries }}</p>
        </div>
      </div>
      <p class="hint">Last visit: {{ FormatDate(project.last_project_visit!, true, true) }}</p>
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
