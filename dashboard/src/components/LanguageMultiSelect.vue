<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'
import { ICONS } from '@/assets/icons'
import type IApiLanguage from '@/models/project/language'
import Checkbox from './Checkbox.vue'

const props = defineProps<{
  languages: IApiLanguage[]
  selected_languages: IApiLanguage[]
}>()

const select_open = ref(false)
const query = ref('')

const filtered_languages = computed(() => {
  const lower_query = query.value.toLowerCase()
  return props.languages.filter(
    (language) =>
      language.title_native.toLowerCase().includes(lower_query) ||
      language.title_eng.toLowerCase().includes(lower_query) ||
      language.code.toLowerCase().includes(lower_query),
  )
})

const emit = defineEmits(['languageSelected'])

const component = ref(null)
onClickOutside(component, (event) => {
  if (select_open.value) {
    select_open.value = false
  }
})
</script>

<template>
  <main id="LanguageSelect" ref="component">
    <div class="select-container">
      <button
        type="button"
        class="secondary with-icon select-header"
        @click="select_open = !select_open"
      >
        <span>{{ selected_languages.length }} languages selected</span>
        <Icon :icon="ICONS.arrow_down" :rotate="select_open ? 2 : 0" />
      </button>
      <div class="select-window panel" v-if="select_open">
        <input type="text" class="search" placeholder="Search languages" v-model="query" />
        <button
          type="button"
          v-for="language in filtered_languages"
          :key="language.id"
          class="tertiary with-icon"
          @click="emit('languageSelected', language.id)"
        >
          <Checkbox
            :checked="
              selected_languages.some((selected_language) => selected_language.id === language.id)
            "
          />
          <Icon :icon="'circle-flags:' + language.code" />
          <span>{{ language.title_eng }} ({{ language.title_native }})</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
#LanguageSelect {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  button {
    width: 100%;
  }
}

.select-container {
  display: flex;
  flex-direction: column;
  position: relative;
}

.select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
}

.select-window {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: absolute;
  top: calc(100%);
  width: calc(100% - 32px);
  overflow-y: scroll;
  max-height: 15rem;
  button.tertiary {
    padding-left: 0;
  }
}

.search {
  margin-bottom: 0.5rem;
}
</style>
