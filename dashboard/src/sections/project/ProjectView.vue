<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import type { IApiError } from '@/models/system/api-error'
import ProjectService from '@/services/ProjectService'
import { useProjectStore } from '@/stores/ProjectStore'
import EntryList from './EntryList.vue'
import EntryWindow from './EntryWindow.vue'

const ProjectStore = useProjectStore()
const loading = ref(true)
const error = ref<IApiError | null>(null)

const route = useRoute()

onMounted(() => {
  FetchData()
})

watch(
  () => route.params.id,
  () => {
    loading.value = true
    error.value = null
    FetchData()
  },
)

function FetchData() {
  ProjectService.GetProject(parseInt(route.params.id.toString()), [
    'entries.translations.author',
    'entries.languages',
    'notes',
    'languages',
    'original_language',
    'entries.translations.comments',
    'entries.translations.votes',
    'owner',
  ])
    .then((res) => {
      ProjectStore.SetProject(res.data)
      /* eslint-disable-next-line no-console */
      console.log(res.data)
    })
    .catch((err) => {
      console.error(err)
      error.value = err
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <Loading v-if="loading" />
  <Error v-else-if="error" :error="error" />

  <main id="Project" v-else-if="ProjectStore.project">
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
