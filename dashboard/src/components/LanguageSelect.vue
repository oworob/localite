<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'
import { ICONS } from '@/assets/icons'
import type { IApiLanguage } from '@/models/project/language'
import Checkbox from './Checkbox.vue'

const props = defineProps<{
  languages: IApiLanguage[]
  selected: IApiLanguage | IApiLanguage[]
  disabled?: boolean
}>()

const emit = defineEmits(['languageSelected'])

const select_open = ref(false)
const query = ref('')
const selected_languages = computed(() => {
  // convert to array if single language is passed
  return Array.isArray(props.selected) ? props.selected : [props.selected]
})
const multiselect = computed(() => Array.isArray(props.selected))

const filtered_languages = computed(() => {
  const lower_query = query.value.toLowerCase()
  return props.languages.filter(
    (language) =>
      language.title_native.toLowerCase().includes(lower_query) ||
      language.title_eng.toLowerCase().includes(lower_query) ||
      language.code.toLowerCase().includes(lower_query),
  )
})

function SelectLanguage(id: number) {
  if (multiselect.value) {
    emit('languageSelected', id)
  } else {
    if (id !== selected_languages.value[0].id) {
      emit('languageSelected', id)
    }
    select_open.value = false
    query.value = ''
  }
}

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
        :disabled="props.disabled"
        class="select with-icon select-header"
        @click="select_open = !select_open"
        :class="{ open: select_open }"
      >
        <div class="main" v-if="multiselect">
          <Icon :icon="ICONS.language" />
          <span
            >{{ selected_languages.length }}
            {{ selected_languages.length === 1 ? 'language' : 'languages' }} selected</span
          >
        </div>
        <div class="main" v-else>
          <Icon :icon="'circle-flags:' + selected_languages[0].code" />
          <span
            >{{ selected_languages[0].title_eng }} ({{ selected_languages[0].title_native }})</span
          >
        </div>
        <Icon :icon="ICONS.arrow_down" :rotate="select_open ? 2 : 0" />
      </button>
      <div class="select-window panel" v-if="select_open">
        <input type="text" class="search" placeholder="Search languages" v-model="query" />
        <button
          type="button"
          v-for="language in filtered_languages"
          :key="language.id"
          class="language-button tertiary with-icon"
          @click="SelectLanguage(language.id)"
        >
          <Checkbox :checked="selected_languages.some((lang) => lang.id === language.id)" />
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
  align-items: center;
  padding: 10px 15px;
  .main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-grow: 1;
  }
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
  z-index: 2;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0;
  button.tertiary {
    padding-left: 0;
  }
}

.search {
  margin-bottom: 0.5rem;
}
</style>
