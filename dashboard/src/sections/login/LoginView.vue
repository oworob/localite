<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UNKNOWN_ERROR } from '@/assets/errors'
import { ICONS } from '@/assets/icons'
import type { IApiAppStats } from '@/models/system/app-stats'
import AuthService from '@/services/AuthService'
import MiscService from '@/services/MiscService'
import { useAuthStore } from '@/stores/AuthStore'
import { useNotificationStore } from '@/stores/NotificationStore'

const AuthStore = useAuthStore()
const NotificationStore = useNotificationStore()

const route = useRoute()
const router = useRouter()
const isLoginView = computed(() => route.path === '/login')

watch(isLoginView, () => {
  email.value = ''
  username.value = ''
  password.value = ''
})

const email = ref('')
const username = ref('')
const password = ref('')
const submitting = ref(false)
const app_stats = ref<IApiAppStats>()

onMounted(() => {
  MiscService.GetAppSummary().then((res) => {
    app_stats.value = res.data
  })
})

function Submit() {
  if (!submitting.value) {
    if (isLoginView.value) {
      Login()
    } else {
      Register()
    }
  }
}

async function Register() {
  submitting.value = true
  try {
    const res = await AuthService.Register(email.value, username.value, password.value)
    AuthStore.SetUser(res.data)
    router.push({ path: '/' })
    NotificationStore.AddNotification(
      `Account created successfully! Welcome, ${res.data.username}!`,
      'success',
    )
  } catch (err: any) {
    if (err.response.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(UNKNOWN_ERROR, 'error')
    }
  } finally {
    submitting.value = false
  }
}

async function Login() {
  submitting.value = true
  try {
    const res = await AuthService.Login(username.value, password.value)
    AuthStore.SetUser(res.data)
    router.push({ path: '/' })
    NotificationStore.AddNotification(`Welcome back, ${res.data.username}!`, 'success')
  } catch (err: any) {
    if (err.response.data.message) {
      NotificationStore.AddNotification(err.response.data.message, 'error')
    } else {
      NotificationStore.AddNotification(UNKNOWN_ERROR, 'error')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main id="Login">
    <div class="login-wrapper">
      <header class="header">
        <h1>{{ isLoginView ? 'Welcome Back!' : 'Welcome!' }}</h1>
        <p class="hint">
          Enter your {{ !isLoginView ? 'e-mail, ' : '' }} username and password to
          {{ isLoginView ? 'continue' : 'create an account' }}.
        </p>
      </header>

      <form class="login-form" @submit.prevent="Submit">
        <div class="form-item" v-if="!isLoginView">
          <label class="hint">E-mail</label>
          <input
            type="email"
            placeholder="john.doe@email.com"
            v-model="email"
            autocomplete="email"
            :disabled="submitting"
          />
        </div>
        <div class="form-item">
          <label class="hint">Username</label>
          <input
            type="text"
            placeholder="JohnDoe1"
            v-model="username"
            autocomplete="username"
            :disabled="submitting"
          />
        </div>
        <div class="form-item">
          <label class="hint">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            v-model="password"
            autocomplete="current-password"
            :disabled="submitting"
          />
        </div>

        <button
          type="submit"
          class="submit-button primary"
          :disabled="submitting || !password || !username"
        >
          {{ isLoginView ? 'Login' : 'Create an Account' }}
        </button>

        <div class="actions" v-if="isLoginView">
          <p class="hint">New around here?</p>
          <RouterLink to="/register">
            <button type="button" class="tertiary">Create an Account</button>
          </RouterLink>
        </div>
        <div class="actions" v-else>
          <p class="hint">Already have an account?</p>
          <RouterLink to="/login">
            <button type="button" class="tertiary">Login</button>
          </RouterLink>
        </div>
      </form>
    </div>

    <aside class="summary pane">
      <div class="item">
        <header class="item-header">
          <Icon :icon="ICONS.users" />
          <h3>{{ app_stats?.users }} users</h3>
        </header>
        <p class="hint">
          Join a community of passionate individuals and collaborate with people from all over the
          world.
        </p>
      </div>
      <div class="item">
        <header class="item-header">
          <Icon :icon="ICONS.project" />
          <h3>{{ app_stats?.projects }} projects</h3>
        </header>
        <p class="hint">Create something new or contribute to projects that matter to you.</p>
      </div>
      <div class="item">
        <header class="item-header">
          <Icon :icon="ICONS.entry" />
          <h3>{{ app_stats?.entries }} entries</h3>
        </header>
        <p class="hint">
          Help translate entries into a variety of languages and make them accessible to everyone.
        </p>
      </div>
      <div class="item">
        <header class="item-header">
          <Icon :icon="ICONS.translation" />
          <h3>{{ app_stats?.translations }} translations</h3>
        </header>
        <p class="hint">Contribute to translations and bridge language barriers.</p>
      </div>
    </aside>
  </main>
</template>

<style scoped lang="scss">
#Login {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 8rem;
  padding: 6rem;
}

.summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10% 1rem;
  gap: 2rem;
  .item {
    .item-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      svg {
        font-size: 2rem;
      }
    }
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    svg {
      color: var(--theme);
    }
  }
}

.login-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    .form-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .submit-button {
      margin-top: 2rem;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      .tertiary {
        padding-left: 0;
      }
    }
  }
}
</style>
