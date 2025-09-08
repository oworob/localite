<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import ProjectService from '@/services/ProjectService'
import { useProjectStore } from '@/stores/ProjectStore'
import ProjectInfoView from './details/ProjectDetailsView.vue'
import ProjectEntries from './entries/ProjectEntriesView.vue'
import ProjectTranslationsView from './translations/ProjectTranslationsView.vue'

const ProjectStore = useProjectStore()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const tabs = [
  {
    name: 'Details',
    icon: ICONS.project,
    admin_only: false,
  },
  { name: 'Translations', icon: ICONS.translation, admin_only: false },
  { name: 'Entries', icon: ICONS.entry, admin_only: true },
  { name: 'Contributors', icon: ICONS.users, admin_only: true },
]

function ChangeTab(tab_name: string) {
  if (route.query.tab !== tab_name.toLowerCase()) {
    router.replace({ query: { ...route.query, tab: tab_name.toLowerCase() } })
  }
}

onMounted(() => {
  if (!route.query.tab) {
    router.replace({ query: { ...route.query, tab: 'details' } })
  }
  FetchData()
})

watch(
  () => route.params.id,
  () => {
    loading.value = true
    error.value = ''
    FetchData()
  },
)

async function FetchData() {
  try {
    const res = await ProjectService.GetProject(parseInt(route.params.id.toString()), [
      'notes',
      'languages',
      'source_language',
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
      <button
        v-for="tab in tabs.filter((tab) => !tab.admin_only || ProjectStore.IsProjectOwner())"
        :key="tab.name"
        :class="{ active: route.query.tab === tab.name.toLowerCase() }"
        class="tab-button hint with-icon"
        @click="ChangeTab(tab.name)"
      >
        <Icon :icon="tab.icon" />
        {{ tab.name == 'Details' ? ProjectStore.project.title : tab.name }}
      </button>
    </div>

    <ProjectInfoView v-if="route.query.tab === 'details'" v-on:refresh-project="FetchData" />
    <ProjectTranslationsView v-if="route.query.tab === 'translations'" />
    <ProjectEntries v-if="route.query.tab === 'entries'" />
  </main>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  .tab-button {
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
