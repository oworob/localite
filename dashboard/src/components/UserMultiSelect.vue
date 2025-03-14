<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onClickOutside, useDebounceFn } from '@vueuse/core'
import { ref, watch } from 'vue'
import { ICONS } from '@/assets/icons'
import { type IApiUser, UserStatus } from '@/models/user/user'
import UserService from '@/services/UserService'
import { useAuthStore } from '@/stores/AuthStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import Checkbox from './Checkbox.vue'

const props = defineProps<{
  selected_users: IApiUser[]
  ignore_self?: boolean
  disabled?: boolean
}>()

const select_open = ref(false)
const query = ref('')
const users = ref<IApiUser[]>([])
const loading = ref(false)

const NotificationStore = useNotificationStore()
const AuthStore = useAuthStore()

function UpdateUserList() {
  if (!loading.value && query.value.length > 0 && /^[a-zA-Z0-9]*$/.test(query.value)) {
    loading.value = true
    UserService.GetUsers(['stats'], query.value)
      .then((res) => {
        if (props.ignore_self) {
          users.value = res.data.filter((user) => user.id !== AuthStore.user?.id)
        } else {
          users.value = res.data
        }
      })
      .catch(() => {
        NotificationStore.AddNotification('Failed to fetch users.', 'error')
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const UpdateUserListDebounced = useDebounceFn(UpdateUserList, 500)

watch(query, () => {
  UpdateUserListDebounced()
})

const emit = defineEmits(['userSelected'])

const component = ref(null)
onClickOutside(component, () => {
  if (select_open.value) {
    select_open.value = false
  }
})
</script>

<template>
  <main id="UserSelect" ref="component">
    <div class="select-container">
      <button
        type="button"
        class="select with-icon select-header"
        :class="{ open: select_open }"
        :disabled="props.disabled"
        @click="select_open = !select_open"
      >
        <Icon :icon="ICONS.users" />
        <span>
          {{ selected_users.length }}
          {{ selected_users.length === 1 ? 'user' : 'users' }} selected</span
        >
        <Icon :icon="ICONS.arrow_down" :rotate="select_open ? 2 : 0" />
      </button>
      <div class="select-window panel" v-if="select_open">
        <input type="text" class="search" placeholder="Search users" v-model="query" />
        <Icon class="icon loading-icon" :icon="ICONS.loading" v-if="loading" />
        <button
          v-for="user in users"
          type="button"
          :key="user.id"
          class="tertiary with-icon user-button"
          @click="emit('userSelected', user)"
        >
          <div class="main">
            <Checkbox
              :checked="selected_users.some((selected_user) => selected_user.id === user.id)"
            />
            <span>{{ user.username }}</span>
          </div>
          <span class="hint status">{{ UserStatus[user.status] }}</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
#UserSelect {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  button {
    width: 100%;
  }
}

.select-container {
  display: flex;
  flex-direction: column;
  position: relative;
}

.select-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  span {
    flex-grow: 1;
    text-align: left;
  }
}

.select-window {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: absolute;
  top: calc(100%);
  width: calc(100% - 32px);
  overflow-y: scroll;
  max-height: 15rem;
  z-index: 2;
  border-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  .user-button {
    padding-left: 0;
    justify-content: space-between;
    .main {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .status {
      font-weight: normal;
    }
  }
}

.search {
  margin-bottom: 0.5rem;
}

.loading-icon {
  font-size: 2rem;
  align-self: center;
}
</style>
