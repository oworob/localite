<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Loading from '@/components/Loading.vue'
import type { IApiProject } from '@/models/project/project'
import ProjectService from '@/services/ProjectService'
import { useAuthStore } from '@/stores/AuthStore'
import Filters from './Filters.vue'
import ProjectButton from './ProjectButton.vue'

const AuthStore = useAuthStore()

const loading = ref(true)

const projects = ref<IApiProject[]>([])
const created_projects = computed(() =>
  projects.value.filter((project) => project.owner_id === AuthStore.user?.id),
)
const joined_projects = computed(() =>
  projects.value.filter((project) => project.owner_id !== AuthStore.user?.id),
)

onMounted(() => {
  ProjectService.GetProjects(['owner', 'languages', 'original_language', 'contributors', 'entries'])
    .then((res) => {
      projects.value = res.data
      loading.value = false
      console.log(res.data)
    })
    .catch((err) => {
      console.error(err)
    })
})
</script>

<template>
  <Loading v-if="loading" />
  <main id="Projects" v-if="!loading">
    <header class="header">
      <h2>Your Projects</h2>
      <RouterLink to="/projects/new">
        <button class="primary with-icon">
          <Icon icon="solar:add-circle-bold" />Create New Project
        </button>
      </RouterLink>
    </header>
    <section class="content">
      <Filters />

      <div class="joined">
        <header class="project-header">
          <h3>Joined</h3>
        </header>
        <div class="projects">
          <ProjectButton v-for="project in joined_projects" :key="project.id" :project="project" />
        </div>
      </div>

      <div class="created">
        <header class="project-header">
          <h3>Created</h3>
        </header>
        <div class="projects">
          <ProjectButton v-for="project in created_projects" :key="project.id" :project="project" />
        </div>
      </div>

      <div class="invites">
        <header class="project-header">
          <h3>Pending Invites</h3>
        </header>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
#Projects {
  .header {
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

.joined,
.created,
.invites {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .projects {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
