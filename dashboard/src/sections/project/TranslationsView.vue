<script setup lang="ts">
import EntryList from './EntryList.vue'
import EntryWindow from './EntryWindow.vue'
</script>

<template>
  <main id="TranslationsView">
    <EntryList />
    <EntryWindow />
  </main>
</template>

<style scoped lang="scss">
#TranslationsView {
  display: grid;
  grid-template-columns: 25% 75%;
}
</style>
