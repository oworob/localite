<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Loading from '@/components/Loading.vue'

const loading = ref(false)
</script>

<template>
  <main id="ProjectManage" v-if="!loading">
    <header class="header">
      <h2>Manage Project</h2>
    </header>
    <nav class="nav">
      <RouterLink to="manage/details">
        <button class="secondary">Details</button>
      </RouterLink>
      <RouterLink to="manage/languages">
        <button class="secondary">Languages</button>
      </RouterLink>
      <RouterLink to="manage/contributors">
        <button class="secondary">Contributors</button>
      </RouterLink>
      <RouterLink to="manage/entries">
        <button class="secondary">Entries</button>
      </RouterLink>
    </nav>
  </main>
  <Loading v-if="loading" />
</template>

<style scoped lang="scss">
#ProjectManage {
  .header {
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 1rem;
    a {
      width: fit-content;
    }
  }
}
</style>
