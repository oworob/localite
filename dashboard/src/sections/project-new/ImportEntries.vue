<script setup lang="ts">
import { onClickOutside, useDropZone } from '@vueuse/core'
import { ref } from 'vue'
import Papa from 'papaparse'
import type { INewEntry } from '@/models/project/entry'

const imported_entries = ref<INewEntry[]>([])
const drop_zone = ref<HTMLDivElement>()
const current_file = ref<File>()
const mode = ref<'append' | 'overwrite'>('append')
const emit = defineEmits(['close', 'saveEntries'])

const component = ref(null)
onClickOutside(component, (event) => {
  emit('close')
})

function SaveEntries() {
  emit('saveEntries', imported_entries.value, mode.value)
}

function ImportEntriesFromCSV(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    const is_csv = files[0].type === 'text/csv'
    if (is_csv) {
      current_file.value = files[0]
      ReadCSVFile(files[0])
    }
  }
}

function ReadCSVFile(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const csv = e.target?.result as string
    Papa.parse(csv, {
      header: false,
      complete: (results: any) => {
        const split = results.data
          .map((row: string[]) => row[0])
          .filter((row: string) => row.length > 0)
        imported_entries.value = split
      },
    })
  }
  reader.readAsText(file)
}

const { isOverDropZone } = useDropZone(drop_zone, {
  onDrop(files) {
    if (files && files.length > 0) {
      current_file.value = files[0]
      ReadCSVFile(files[0])
    }
  },
  dataTypes: ['text/csv'],
  multiple: false,
  preventDefaultForUnhandled: true,
})
</script>

<template>
  <main id="ImportEntries" class="modal">
    <div class="content panel" ref="component">
      <header class="header">
        <h3>Import Entries</h3>
        <p class="hint">Upload a CSV file containing only the entries (one per line).</p>
      </header>

      <div class="drag-window" ref="drop_zone" :class="{ 'is-over': isOverDropZone }">
        <label for="file" class="file-label">
          {{
            current_file
              ? current_file.name +
                ` (${imported_entries.length} ${
                  imported_entries.length === 1 ? 'entry' : 'entries'
                } found)`
              : 'Select or drag file'
          }}
        </label>
        <input type="file" id="file" accept=".csv" @change="ImportEntriesFromCSV" />
      </div>

      <div class="options">
        <label for="append" class="radio-label"
          >Append to existing entries
          <input type="radio" id="append" name="mode" value="append" v-model="mode" />
        </label>

        <label for="overwrite" class="radio-label"
          >Overwrite existing entries
          <input type="radio" id="overwrite" name="mode" value="overwrite" v-model="mode" />
        </label>
      </div>

      <div class="actions">
        <button class="primary with-icon" @click="SaveEntries" :disabled="!current_file">
          <Icon icon="solar:upload-square-bold" />
          Import
        </button>
        <button class="tertiary" @click="emit('close')">Cancel</button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.drag-window {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed var(--text-disabled);
  border-radius: 5px;
  transition: var(--transition);
  &.is-over,
  &:hover {
    border-color: var(--theme);
  }
}

.file-label {
  width: 100%;
  min-height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
input[type='file'] {
  display: none;
}

.actions {
  display: flex;
  align-items: center;
}

.options {
  display: flex;
  gap: 1rem;
}
</style>
