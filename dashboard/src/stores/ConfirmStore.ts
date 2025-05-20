import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('ConfirmStore', () => {
  const modal_data = ref({
    open: false,
    title: '',
    message: '',
    confirm_text: '',
    cancel_text: '',
    danger: false,
  })
  let resolvePromise: (value: boolean) => void

  function Open(
    title: string,
    message: string,
    confirm_text?: string,
    cancel_text?: string,
    danger?: boolean,
  ): Promise<boolean> {
    modal_data.value.open = true
    modal_data.value.title = title
    modal_data.value.message = message
    modal_data.value.confirm_text = confirm_text || 'Confirm'
    modal_data.value.cancel_text = cancel_text || 'Cancel'
    modal_data.value.danger = danger || false

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function Cancel() {
    resolvePromise(false)
    modal_data.value.open = false
  }

  function Confirm() {
    resolvePromise(true)
    modal_data.value.open = false
  }

  return { Open, Confirm, Cancel, modal_data }
})
