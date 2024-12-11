<script setup lang="ts">
import Filters from './Filters.vue'
</script>

<template>
  <main id="Projects">
    <Filters />
  </main>
</template>

<style scoped lang="scss">
#Projects {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>
