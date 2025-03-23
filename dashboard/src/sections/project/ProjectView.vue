<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import ProjectService from '@/services/ProjectService'
import { useProjectStore } from '@/stores/ProjectStore'
import EntryList from './EntryList.vue'
import EntryWindow from './EntryWindow.vue'

const ProjectStore = useProjectStore()
const loading = ref(true)
const error = ref('')

const route = useRoute()

onMounted(() => {
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
      'entries.translations.author',
      'entries.languages',
      'notes',
      'languages',
      'source_language',
      'entries.translations.comments',
      'entries.translations.votes',
      'owner',
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
    <EntryList />
    <EntryWindow />
  </main>
</template>

<style scoped lang="scss">
#Project {
  display: grid;
  grid-template-columns: 25% 75%;
}
</style>
