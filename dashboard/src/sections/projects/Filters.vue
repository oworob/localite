<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import LanguageSelect from '../../components/LanguageSelect.vue'
import type IApiLanguage from '@/models/project/language'
import LanguageService from '@/services/LanguageService'

const languages = ref<IApiLanguage[]>([])
// const selected_language = ref<IApiLanguage>()

onMounted(() => {
  LanguageService.GetLanguages().then((res) => {
    languages.value = res.data
    console.log(res.data)
  })
})
</script>

<template>
  <main id="Filters">
    <div class="filters">
      <h4>Search</h4>
      <input type="text" id="search" placeholder="Project name" />
      <!-- <LanguageSelect -->
    </div>
  </main>
</template>

<style scoped lang="scss">
#Filters {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
