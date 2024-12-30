<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside, useDebounceFn } from '@vueuse/core'
import { Icon } from '@iconify/vue/dist/iconify.js'
import type { IApiUser } from '@/models/user/user'
import UserService from '@/services/UserService'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useAuthStore } from '@/stores/AuthStore'

const props = defineProps<{
  selected_users: IApiUser[]
  ignore_self?: boolean
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
    UserService.GetUsers([], query.value)
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
  } else if (query.value.length === 0) {
    users.value = []
  }
}

const UpdateUserListDebounced = useDebounceFn(UpdateUserList, 500)

watch(query, () => {
  UpdateUserListDebounced()
})

const emit = defineEmits(['userSelected'])

const component = ref(null)
onClickOutside(component, (event) => {
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
        class="secondary with-icon select-header"
        @click="select_open = !select_open"
      >
        <span>{{ selected_users.length }} users selected</span>
        <Icon icon="solar:alt-arrow-down-bold" :class="{ rotated: select_open }" />
      </button>
      <div class="select-window panel" v-if="select_open">
        <input type="text" class="search" placeholder="Search users" v-model="query" />
        <Icon class="icon loading-icon" icon="mingcute:loading-3-fill" v-if="loading" />
        <button
          v-if="!loading"
          v-for="user in users"
          type="button"
          :key="user.id"
          class="with-icon"
          :class="
            selected_users.find((selected_user) => selected_user.id === user.id)
              ? 'primary'
              : 'tertiary'
          "
          @click="emit('userSelected', user)"
        >
          <span>{{ user.username }}</span>
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
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
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
  button.tertiary {
    padding-left: 0;
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
