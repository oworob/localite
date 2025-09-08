<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { ICONS } from '@/assets/icons'
import Checkbox from '@/components/Checkbox.vue'

interface IFilterOption {
  label: string
  value: string
  fun: (entry: any) => boolean
}

const props = defineProps<{
  selected: string
  options: IFilterOption[]
}>()

const emit = defineEmits(['filterSelected'])

const select_open = ref(false)

function SelectOption(option: string) {
  if (option !== props.selected) {
    emit('filterSelected', option)
  }
  select_open.value = false
}

const component = ref(null)
onClickOutside(component, (event) => {
  if (select_open.value) {
    select_open.value = false
  }
})
</script>

<template>
  <main id="EntryFilterSelect" ref="component">
    <div class="select-container">
      <button
        type="button"
        class="select with-icon select-header"
        @click="select_open = !select_open"
        :class="{ open: select_open }"
      >
        <div class="main">
          <span>{{ props.options.find((opt) => opt.value === props.selected)!.label }}</span>
        </div>
        <Icon :icon="ICONS.arrow_down" :rotate="select_open ? 2 : 0" />
      </button>

      <div class="select-window panel" v-if="select_open">
        <button
          type="button"
          v-for="option in options"
          :key="option.value"
          class="language-button tertiary with-icon"
          @click="SelectOption(option.value)"
        >
          <Checkbox :checked="props.selected === option.value" />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
#EntryFilterSelect {
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
