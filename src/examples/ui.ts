import puter from '@heyputer/puter.js'
import { getErrorMessage } from './helpers'

export const initUi = () => {
  const uiResult = document.querySelector<HTMLElement>('[data-ui-result]')
  const openBtn = document.querySelector<HTMLButtonElement>('[data-ui-open]')
  if (!uiResult || !openBtn) return

  openBtn.addEventListener('click', async () => {
    try {
      const result = await puter.ui.showOpenFilePicker({ multiple: false })
      const file = Array.isArray(result) ? result[0] : result
      uiResult.textContent = file ? `Selected file: ${file.name || file.path || 'unknown'}` : 'No file selected'
    } catch (error) {
      uiResult.textContent = `File picker failed: ${getErrorMessage(error)}`
    }
  })
}
