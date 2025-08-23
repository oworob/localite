<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ICONS } from '@/assets/icons'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import ProjectService from '@/services/ProjectService'
import { useProjectStore } from '@/stores/ProjectStore'
import ProjectEntries from './entries/ProjectEntries.vue'
import ProjectInfoView from './ProjectDetailsView.vue'
import TranslationsView from './TranslationsView.vue'

const ProjectStore = useProjectStore()
const loading = ref(true)
const error = ref('')
const tabs = [
  {
    name: '',
    path: '',
    icon: ICONS.project,
    admin_only: false,
  },
  { name: 'Translations', path: '?tab=translations', icon: ICONS.translation, admin_only: false },
  { name: 'Entries', path: '?tab=entries', icon: ICONS.entry, admin_only: true },
  { name: 'Contributors', path: '?tab=contributors', icon: ICONS.users, admin_only: true },
]
const Route = useRoute()

onMounted(() => {
  FetchData()
})

watch(
  () => Route.params.id,
  () => {
    loading.value = true
    error.value = ''
    FetchData()
  },
)

async function FetchData() {
  try {
    const res = await ProjectService.GetProject(parseInt(Route.params.id.toString()), [
      'entries.translations.author',
      'entries.languages',
      'notes',
      'languages',
      'source_language',
      'entries.translations.comments',
      'entries.translations.votes',
      'owner',
      'updates',
    ])
    ProjectStore.SetProject(res.data)
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
</script>

<template>
  <Loading v-if="loading" />
  <Error v-if="error" :error="error" />

  <main id="Project" v-if="!loading && !error && ProjectStore.project">
    <div class="tabs">
      <RouterLink
        v-for="tab in tabs.filter((tab) => !tab.admin_only || ProjectStore.IsProjectOwner())"
        :key="tab.name"
        :to="tab.path"
        :class="{ active: Route.query.tab === tab.path.split('=')[1] }"
        class="hint with-icon"
      >
        <Icon :icon="tab.icon" />
        {{ !tab.name ? ProjectStore.project.title : tab.name }}
      </RouterLink>
    </div>

    <ProjectInfoView v-if="!Route.query.tab" v-on:refresh-project="FetchData" />
    <TranslationsView v-if="Route.query.tab === 'translations'" />
    <ProjectEntries v-if="Route.query.tab === 'entries'" />
  </main>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  a {
    padding: 0.5rem 2rem;
    width: 100%;
    border-bottom: 1px solid var(--panel-border);
    border-radius: 5px 5px 0 0;
    justify-content: center;
    &.active {
      color: var(--text);
      border-color: var(--theme);
      background-color: var(--panel);
    }
    &:hover {
      border-color: var(--theme);
    }
  }
}
</style>
