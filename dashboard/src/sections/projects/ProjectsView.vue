<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ICONS } from '@/assets/icons'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import type { IApiInvite } from '@/models/project/invite'
import type { IApiProject } from '@/models/project/project'
import InviteService from '@/services/InviteService'
import ProjectService from '@/services/ProjectService'
import { useAuthStore } from '@/stores/AuthStore'
import Filters from './Filters.vue'
import Invite from './Invite.vue'
import ProjectButton from './ProjectButton.vue'

const AuthStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const projects = ref<IApiProject[]>([])
const invites = ref<IApiInvite[]>([])
const created_projects = computed(() =>
  projects.value.filter((project) => project.owner_id === AuthStore.user?.id),
)
const joined_projects = computed(() =>
  projects.value.filter((project) => project.owner_id !== AuthStore.user?.id),
)

async function FetchData() {
  try {
    loading.value = true
    const res = await ProjectService.GetProjects([
      'owner',
      'languages',
      'source_language',
      'contributors',
      'entries',
    ])
    projects.value = res.data
    const res2 = await InviteService.GetInvites([
      'project.owner',
      'project.stats',
      'project.source_language',
      'project.languages',
    ])
    invites.value = res2.data
  } catch (err: any) {
    if (err.response?.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

function HandleInviteAccept(id: number) {
  FetchData()
}

function HandleInviteDecline(id: number) {
  invites.value = invites.value.filter((invite) => invite.id !== id)
}

onMounted(() => {
  FetchData()
})
</script>

<template>
  <Loading v-if="loading" />
  <Error v-if="error" :error="error" />

  <main id="Projects" v-if="!loading && !error">
    <header class="header">
      <h2>Your Projects</h2>
      <RouterLink to="/projects/new">
        <button class="primary with-icon"><Icon :icon="ICONS.add" />Create New Project</button>
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
        <header class="invites-header">
          <h3>Invites</h3>
        </header>
        <span class="hint"
          >You have {{ invites.length }} pending invite{{ invites.length !== 1 ? 's' : '' }}.</span
        >
        <div class="invites-list">
          <Invite
            v-for="invite in invites"
            :key="invite.id"
            :invite="invite"
            @accept="HandleInviteAccept"
            @reject="HandleInviteDecline"
          />
        </div>
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
  .projects,
  .invites-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
