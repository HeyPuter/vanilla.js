import puter from '@heyputer/puter.js'
import { getDemoPath, getErrorMessage } from './helpers'

export const initFilesystem = () => {
  const fsStatus = document.querySelector<HTMLElement>('[data-fs-status]')
  const fsContents = document.querySelector<HTMLElement>('[data-fs-contents]')
  const fsCallout = document.querySelector<HTMLElement>('[data-fs-callout]')
  const demoPathEl = document.querySelector<HTMLElement>('[data-demo-path]')
  const writeBtn = document.querySelector<HTMLButtonElement>('[data-fs-action="write"]')
  const readBtn = document.querySelector<HTMLButtonElement>('[data-fs-action="read"]')
  if (!fsStatus || !fsContents || !fsCallout || !demoPathEl || !writeBtn || !readBtn) return

  const demoPath = getDemoPath()
  demoPathEl.textContent = demoPath

  writeBtn.addEventListener('click', async () => {
    fsStatus.textContent = 'Status: Writing sample file...'
    try {
      await puter.fs.write(demoPath, `Hello from Puter.js at ${new Date().toISOString()}`)
      fsStatus.textContent = `Status: Wrote sample text to ${demoPath}`
    } catch (error) {
      fsStatus.textContent = `Status: Write failed: ${getErrorMessage(error)}`
    }
  })

  readBtn.addEventListener('click', async () => {
    fsStatus.textContent = 'Status: Reading file...'
    try {
      const blob = await puter.fs.read(demoPath)
      const text = await blob.text()
      fsContents.textContent = text
      fsCallout.hidden = false
      fsStatus.textContent = 'Status: Read succeeded'
    } catch (error) {
      fsStatus.textContent = `Status: Read failed: ${getErrorMessage(error)}`
    }
  })
}
