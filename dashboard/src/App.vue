<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Notifications from './components/Notifications.vue'
import TopBar from './components/TopBar.vue'
import AuthService from './services/AuthService'
import { useAuthStore } from './stores/AuthStore'
import { useNotificationStore } from './stores/NotificationStore'

const AuthStore = useAuthStore()
const NotificationStore = useNotificationStore()

onMounted(() => {
  AuthService.GetCurrentUser().then((res) => {
    AuthStore.SetUser(res.data)
    NotificationStore.AddNotification(`Welcome back, ${res.data.username}!`, 'success')
  })
})
</script>

<template>
  <TopBar />
  <Notifications />

  <RouterView />
</template>
