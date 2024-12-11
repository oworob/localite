<template>
  <main id="Conversation">
    <header>
      <h4>Conversation</h4>
      <p v-if="comments.length === 0" class="hint">No comments have been added yet.</p>
    </header>
    <div class="comments">
      <div v-for="comment in comments" :key="comment.id" class="comment panel">
        <p class="hint">{{ comment.user_id }}</p>
        <p>{{ comment.content }}</p>
        <p class="hint">{{ FormatDate(comment.created_at, true) }}</p>
      </div>
    </div>
    <form class="comment-form">
      <textarea></textarea>
      <button class="primary">Add</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import type { IApiComment } from '@/models/project/comment'
import { FormatDate } from '@/tools/FormatDate'

const props = defineProps<{
  comments: IApiComment[]
}>()
</script>

<style scoped lang="scss">
#Conversation {
  align-self: start;
  position: sticky;
  top: var(--topbar-height);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .comments {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    button {
      align-self: flex-end;
    }
    textarea {
      padding: 10px 15px;
    }
  }
}
</style>
