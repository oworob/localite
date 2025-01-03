<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Error from '@/components/Error.vue'
import Loading from '@/components/Loading.vue'
import type { IApiEntry } from '@/models/project/entry'
import type IApiLanguage from '@/models/project/language'
import type { IApiProject } from '@/models/project/project'
import type { IApiError } from '@/models/system/api-error'
import ProjectService from '@/services/ProjectService'
import EntryList from './EntryList.vue'
import EntryWindow from './EntryWindow.vue'

const project = ref<IApiProject>()
const selected_entry = ref<IApiEntry>()
const selected_language = ref<IApiLanguage>()
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
  ])
    .then((res) => {
      project.value = res.data
      selected_entry.value = res.data.entries![0]
      selected_language.value = res.data.languages![0]
    })
    .catch((err) => {
      console.log(err)
      error.value = err
    })
    .finally(() => {
      loading.value = false
    })
}

function HandleEntrySelected(id: number) {
  selected_entry.value = project.value!.entries!.find((entry) => entry.id === id)
}

function HandleLanguageSelected(id: number) {
  selected_language.value = project.value!.languages!.find((language) => language.id === id)
}
</script>

<template>
  <Loading v-if="loading" />
  <Error v-else-if="error" :error="error" />

  <main id="Project" v-else-if="project && selected_entry && selected_language">
    <EntryList
      @entry-selected="HandleEntrySelected"
      @language-selected="HandleLanguageSelected"
      :project="project"
      :selected_entry="selected_entry"
      :selected_language="selected_language"
    />
    <EntryWindow
      :project="project"
      :selected_entry="selected_entry"
      :selected_language="selected_language"
    />
    <!-- <Conversation :comments="selected_entry.comments" /> -->
  </main>
</template>

<style scoped lang="scss">
#Project {
  display: grid;
  grid-template-columns: 20% 60% 20%;
}
</style>
