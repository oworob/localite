<script setup lang="ts">
import { ref } from 'vue'
import type IApiLanguage from '@/models/project/language'
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{
  languages: IApiLanguage[]
  selected_language: IApiLanguage
}>()

const select_open = ref(false)

const emit = defineEmits(['languageSelected'])

function SelectLanguage(id: number) {
  if (id !== props.selected_language.id) {
    emit('languageSelected', id)
  }
  select_open.value = !select_open.value
}
</script>

<template>
  <main id="LanguageSelect">
    <p>Language:</p>
    <div class="select-container">
      <button class="secondary with-icon select-header" @click="select_open = !select_open">
        <div class="main">
          <Icon :icon="'circle-flags:' + selected_language.code" />
          <span>{{ selected_language.title_native }}</span>
        </div>
        <Icon icon="solar:alt-arrow-down-bold" :class="{ rotated: select_open }" />
      </button>
      <div class="select-window panel" v-if="select_open">
        <button
          v-for="language in languages"
          :key="language.id"
          class="with-icon"
          :class="language.id === selected_language.id ? 'primary' : 'tertiary'"
          @click="SelectLanguage(language.id)"
        >
          <Icon :icon="'circle-flags:' + language.code" />
          <span>{{ language.title_native }}</span>
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
  .main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.select-window {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100%);
  width: calc(100% - 32px);
  button.tertiary {
    padding-left: 0;
  }
}
</style>
