<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ICONS } from '@/assets/icons'
import AuthService from '@/services/AuthService'
import LiveService from '@/services/LiveService'
import { useAuthStore } from '@/stores/AuthStore'
import { useProjectStore } from '@/stores/ProjectStore'
import Messages from './Messages.vue'
import ThemeEditor from './ThemeEditor.vue'

const topbar = ref<HTMLElement>()
onMounted(() => {
  const topbarHeight = topbar.value!.clientHeight - 1
  document.documentElement.style.setProperty('--topbar-height', `${topbarHeight + 1}px`)
})

const AuthStore = useAuthStore()
const ProjectStore = useProjectStore()
const router = useRouter()

function Logout() {
  AuthService.Logout().then(() => {
    router.push('/login')
    LiveService.disconnect()
    AuthStore.SetUser(null)
  })
}
</script>

<template>
  <nav id="TopBar" ref="topbar">
    <div class="links">
      <RouterLink to="/" class="logo">
        <img src="@/assets/images/Logo.png" alt="Logo" />
      </RouterLink>
      <RouterLink to="/projects" class="secondary with-icon">
        <Icon :icon="ICONS.project" />
        Projects
      </RouterLink>
      <a href="https://github.com/oworob/localite" target="_blank" class="secondary with-icon">
        <Icon :icon="ICONS.github" />
        GitHub
      </a>
      <a
        href="https://github.com/oworob/localite/issues"
        target="_blank"
        class="secondary with-icon"
      >
        <Icon :icon="ICONS.bug" />
        Submit a Bug
      </a>
    </div>

    <div class="right">
      <div class="actions" v-if="!AuthStore.user">
        <RouterLink to="/login" class="primary"> Login </RouterLink>
        <RouterLink to="/register" class="secondary"> Register </RouterLink>
      </div>

      <div class="user" v-else>
        <div class="socket" :class="{ connected: LiveService.connected.value }"></div>
        <p class="username">{{ AuthStore.user.username }}</p>
        <Messages v-if="AuthStore.user" />
        <button class="logout secondary" @click="Logout">Logout</button>
      </div>

      <ThemeEditor />
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
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  > div {
    padding: 0.5rem;
  }
}

.logo {
  display: flex;
  img {
    height: 1.7rem;
    background-color: var(--theme);
    border-radius: 5px;
    padding: 2px;
    transition: var(--transition);
    &:hover {
      transform: scale(1.1);
    }
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

.socket {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--theme-color);
  background-color: var(--panel-border);
  &.connected {
    background-color: var(--success);
  }
}
</style>
