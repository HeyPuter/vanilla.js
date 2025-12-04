import puter from '@heyputer/puter.js'
import { extractText, getErrorMessage } from './helpers'

export const initAi = () => {
  const aiInput = document.querySelector<HTMLTextAreaElement>('[data-ai-input]')
  const aiSend = document.querySelector<HTMLButtonElement>('[data-ai-send]')
  const aiStatus = document.querySelector<HTMLElement>('[data-ai-status]')
  const aiHistoryWrap = document.querySelector<HTMLElement>('[data-ai-history]')
  const aiHistoryList = document.querySelector<HTMLElement>('[data-ai-history-list]')
  if (!aiInput || !aiSend || !aiStatus || !aiHistoryWrap || !aiHistoryList) return

  let isAiLoading = false

  aiSend.addEventListener('click', async () => {
    const value = aiInput.value.trim()
    if (!value || isAiLoading) return
    isAiLoading = true
    aiStatus.textContent = 'Status: Sending to Puter AI...'
    aiSend.disabled = true
    try {
      const response = await puter.ai.chat(value)
      const text = extractText(response)
      const turn = document.createElement('div')
      turn.className = 'chat-turn'
      turn.innerHTML = `
        <div class="chat-label">You</div>
        <div class="chat-bubble"></div>
        <div class="chat-label">Puter AI</div>
        <div class="chat-bubble alt"></div>
      `
      const bubbles = turn.querySelectorAll<HTMLElement>('.chat-bubble')
      bubbles[0].textContent = value
      bubbles[1].textContent = text
      aiHistoryList.appendChild(turn)
      aiHistoryWrap.hidden = false
      aiInput.value = ''
      aiStatus.textContent = 'Status: Reply received'
    } catch (error) {
      aiStatus.textContent = `Status: Error: ${getErrorMessage(error)}`
    } finally {
      isAiLoading = false
      aiSend.disabled = false
    }
  })
}
