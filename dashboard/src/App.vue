<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import ConfirmModal from './components/ConfirmModal.vue'
import Notifications from './components/Notifications.vue'
import TopBar from './components/TopBar.vue'
import AuthService from './services/AuthService'
import { useAuthStore } from './stores/AuthStore'

const AuthStore = useAuthStore()

onMounted(() => {
  AuthService.GetCurrentUser().then((res) => {
    AuthStore.SetUser(res.data)
  })
})
</script>

<template>
  <TopBar />
  <Notifications />
  <ConfirmModal />

  <RouterView />
</template>
