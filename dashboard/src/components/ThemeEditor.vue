<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside } from '@vueuse/core'
import { capitalize, onMounted, ref, watch } from 'vue'
import { ICONS } from '@/assets/icons'
import PersistenceService from '@/services/PersistenceService'
import Switch from './Switch.vue'

const color_themes = ['green', 'blue', 'red', 'yellow', 'purple', 'orange', 'pink']

const theme_window_open = ref(false)
const light_theme = ref(false)
const color_theme = ref('green')

function UpdateLightTheme() {
  light_theme.value = !light_theme.value
  document.documentElement.setAttribute('data-light-theme', light_theme.value.toString())
  PersistenceService.Set('light_theme', light_theme.value)
}

function UpdateColorTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
  PersistenceService.Set('theme', theme)
}

watch(color_theme, UpdateColorTheme)

onMounted(() => {
  const saved_color_theme = PersistenceService.Get<string>('theme')
  if (saved_color_theme) {
    color_theme.value = saved_color_theme
    document.documentElement.setAttribute('data-theme', saved_color_theme)
  }
  const saved_light_theme = PersistenceService.Get<boolean>('light_theme')
  if (saved_light_theme !== null) {
    light_theme.value = saved_light_theme
    document.documentElement.setAttribute('data-light-theme', saved_light_theme.toString())
  }
})

const component = ref(null)
onClickOutside(component, (event) => {
  theme_window_open.value = false
})
</script>

<template>
  <div id="ThemeEditor" ref="component">
    <button
      class="toggle icon"
      :class="theme_window_open ? 'primary' : 'tertiary'"
      @click="theme_window_open = !theme_window_open"
      aria-label="Theme editor toggle"
    >
      <Icon :icon="ICONS.theme" />
    </button>

    <div class="theme-window panel" v-if="theme_window_open">
      <div class="dark-theme">
        <Icon :icon="ICONS.sun" />
        <Switch
          class="theme-switch"
          :checked="!light_theme"
          @click="UpdateLightTheme"
          aria-label="Dark mode toggle"
        />
        <Icon :icon="ICONS.moon" />
      </div>

      <label class="hint">Theme</label>

      <div class="color-theme">
        <label
          :for="theme"
          class="radio-label"
          v-for="theme in color_themes"
          :key="theme"
          :style="{ '--theme-color': `var(--theme-${theme})` }"
          :aria-label="'Theme color ' + theme"
        >
          <input type="radio" :id="theme" name="color-theme" :value="theme" v-model="color_theme" />
          {{ capitalize(theme) }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#ThemeEditor {
  position: relative;
  .theme-window {
    position: absolute;
    top: 110%;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dark-theme {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    svg {
      font-size: 1.4rem;
    }
  }

  .color-theme {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .radio-label {
      &:before {
        outline-color: var(--theme-color);
      }
      &:has(input[type='radio']:checked):before {
        background-color: var(--theme-color);
      }
    }
  }
}
</style>
