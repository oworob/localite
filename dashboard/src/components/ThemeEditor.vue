<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside } from '@vueuse/core'
import { capitalize, onMounted, ref, watch } from 'vue'
import { ICONS } from '@/assets/icons'
import PersistenceService from '@/services/PersistenceService'
import Switch from './Switch.vue'

const color_themes = ['green', 'blue', 'red', 'yellow', 'purple', 'orange', 'pink']
const font_sizes = ref({
  small: 0.9,
  normal: 1,
  large: 1.1,
  huge: 1.2,
})

const theme_window_open = ref(false)
const font_size = ref(1)
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

function UpdateFontSize(size: number) {
  font_size.value = size
  document.documentElement.style.fontSize = `${size}rem`
  PersistenceService.Set('font_size', size)
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
  const saved_font_size = PersistenceService.Get<number>('font_size')
  if (saved_font_size) {
    font_size.value = saved_font_size
    document.documentElement.style.fontSize = `${saved_font_size}rem`
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
          {{ capitalize(theme) }}
          <input type="radio" :id="theme" name="color-theme" :value="theme" v-model="color_theme" />
        </label>
      </div>

      <div class="list-item font-size">
        <label class="hint">Font Size</label>
        <div class="sizes">
          <button
            v-for="(size, label) in font_sizes"
            :key="label"
            :class="[font_size === size ? 'primary' : 'tertiary', label + '-button']"
            @click="UpdateFontSize(size)"
            :aria-label="'Font size ' + label"
          >
            {{ capitalize(label) }}
          </button>
        </div>
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

  .font-size {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .sizes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25rem;
      button {
        width: 100%;
      }
    }
  }
}
</style>
