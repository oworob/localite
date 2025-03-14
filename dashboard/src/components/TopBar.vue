<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import AuthService from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'

const topbar = ref<HTMLElement | null>(null)
onMounted(() => {
  if (topbar.value) {
    const topbarHeight = topbar.value.clientHeight - 1
    document.documentElement.style.setProperty('--topbar-height', `${topbarHeight + 1}px`)
  }
})

const AuthStore = useAuthStore()
const router = useRouter()

function Logout() {
  AuthService.Logout().then(() => {
    router.push('/login')
    AuthStore.SetUser(null)
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
      <RouterLink to="/projects">
        <button class="tertiary with-icon">
          <Icon :icon="ICONS.project" />
          Projects
        </button>
      </RouterLink>
      <RouterLink to="/users">
        <button class="tertiary with-icon">
          <Icon :icon="ICONS.users" />
          Users
        </button>
      </RouterLink>
      <RouterLink to="/messages">
        <button class="tertiary with-icon">
          <Icon :icon="ICONS.message" />
          Inbox
        </button>
      </RouterLink>
      <RouterLink to="/projects/1">
        <button class="tertiary">P1</button>
      </RouterLink>
      <RouterLink to="/projects/2">
        <button class="tertiary">P2</button>
      </RouterLink>
      <RouterLink to="/projects/3">
        <button class="tertiary">P3</button>
      </RouterLink>
      <a href="https://github.com/oworob/localite" target="_blank">
        <button class="tertiary with-icon">
          <Icon :icon="ICONS.github" />
          GitHub
        </button>
      </a>
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
  z-index: 100;
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
