<script setup lang="ts">
import AuthService from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const topbar = ref<HTMLElement | null>(null)
onMounted(() => {
  if (topbar.value) {
    const topbarHeight = topbar.value.clientHeight
    document.documentElement.style.setProperty('--topbar-height', `${topbarHeight + 1}px`)
  }
})

const AuthStore = useAuthStore()
const router = useRouter()

function Logout() {
  AuthService.Logout().then(() => {
    AuthStore.SetUser(null)
    router.push('/login')
  })
}
</script>

<template>
  <nav id="TopBar" ref="topbar">
    <div class="logo">[LOGO] LOCALITE</div>
    <div class="links">
      <RouterLink to="/">
        <button class="tertiary">Home</button>
      </RouterLink>
      <RouterLink to="/about">
        <button class="tertiary">About</button>
      </RouterLink>
      <RouterLink to="/projects">
        <button class="tertiary">Projects</button>
      </RouterLink>
      <RouterLink to="/projects/1">
        <button class="tertiary">Project 1</button>
      </RouterLink>
      <RouterLink to="/projects/2">
        <button class="tertiary">Project 2</button>
      </RouterLink>
      <RouterLink to="/projects/3">
        <button class="tertiary">Project 3</button>
      </RouterLink>
    </div>

    <div class="actions" v-if="!AuthStore.user">
      <RouterLink to="/login">
        <button class="primary">Login</button>
      </RouterLink>
      <RouterLink to="/register">
        <button class="secondary">Register</button>
      </RouterLink>
    </div>

    <div class="user" v-else>
      <p class="username">{{ AuthStore.user.username }}</p>
      <button class="secondary" @click="Logout">Logout</button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
#TopBar {
  z-index: 1000;
  background: var(--background);
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .links {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  > div {
    padding: 0.5rem 2rem;
  }
}

.user,
.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  .username {
    font-weight: bold;
  }
}
</style>
