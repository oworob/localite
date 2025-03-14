<script setup lang="ts">
import { useNotificationStore } from '@/stores/NotificationStore'

const NotificationStore = useNotificationStore()
</script>

<template>
  <div id="Notifications">
    <div
      v-for="notification in NotificationStore.notifications"
      :key="notification.id"
      :class="['notification panel', notification.type, { removing: notification.removing }]"
      @click="NotificationStore.RemoveNotification(notification.id)"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
#Notifications {
  position: fixed;
  top: var(--topbar-height);
  right: 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 20%;
  pointer-events: none;
  z-index: 200;
}
.notification {
  cursor: pointer;
  transition: var(--transition);
  transform: translateY(0);
  position: relative;
  pointer-events: initial;
  &.removing {
    transform: translateX(calc(100% + 1rem));
  }
  &:hover {
    border-color: var(--text);
  }
  &.error {
    background-color: var(--error);
  }
  &.success {
    background-color: var(--success);
  }
  &.warn {
    background-color: var(--warn);
  }
  animation: slide-in var(--transition);
}

@keyframes slide-in {
  from {
    right: -100%;
  }
  to {
    right: 0;
  }
}
</style>
