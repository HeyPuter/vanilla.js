import puter from '@heyputer/puter.js'
import { formatJSON, getErrorMessage } from './helpers'

export const initOs = () => {
  const osStatus = document.querySelector<HTMLElement>('[data-os-status]')
  const osUserWrap = document.querySelector<HTMLElement>('[data-os-user]')
  const osUserPre = document.querySelector<HTMLElement>('[data-os-user-pre]')
  const osVersionWrap = document.querySelector<HTMLElement>('[data-os-version]')
  const osVersionPre = document.querySelector<HTMLElement>('[data-os-version-pre]')
  const userBtn = document.querySelector<HTMLButtonElement>('[data-os-action="user"]')
  const versionBtn = document.querySelector<HTMLButtonElement>('[data-os-action="version"]')
  if (!osStatus || !osUserWrap || !osUserPre || !osVersionWrap || !osVersionPre || !userBtn || !versionBtn) return

  userBtn.addEventListener('click', async () => {
    osStatus.textContent = 'Status: Fetching user...'
    try {
      const user = await puter.os.user()
      osUserPre.textContent = formatJSON(user)
      osUserWrap.hidden = false
      osStatus.textContent = 'Status: User info loaded'
    } catch (error) {
      osStatus.textContent = `Status: User lookup failed: ${getErrorMessage(error)}`
    }
  })

  versionBtn.addEventListener('click', async () => {
    osStatus.textContent = 'Status: Fetching version...'
    try {
      const version = await puter.os.version()
      osVersionPre.textContent = formatJSON(version)
      osVersionWrap.hidden = false
      osStatus.textContent = 'Status: Version loaded'
    } catch (error) {
      osStatus.textContent = `Status: Version lookup failed: ${getErrorMessage(error)}`
    }
  })
}
