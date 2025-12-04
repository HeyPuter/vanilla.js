import puter from '@heyputer/puter.js'

export const initKv = () => {
  const kvValueEl = document.querySelector<HTMLElement>('[data-kv-value]')
  const incrBtn = document.querySelector<HTMLButtonElement>('[data-kv-action="incr"]')
  const decrBtn = document.querySelector<HTMLButtonElement>('[data-kv-action="decr"]')
  if (!kvValueEl || !incrBtn || !decrBtn) return

  let kvLocal = 0

  const updateKvUi = () => {
    kvValueEl.textContent = kvLocal.toString()
    incrBtn.disabled = false
    decrBtn.disabled = false
  }

  const loadKv = async () => {
    incrBtn.disabled = true
    decrBtn.disabled = true
    kvValueEl.textContent = 'loading...'
    try {
      const counter = await puter.kv.get<number>('testCounter')
      kvLocal = counter || 0
    } catch {
      kvLocal = 0
    }
    updateKvUi()
  }

  incrBtn.addEventListener('click', async () => {
    kvLocal += 1
    updateKvUi()
    await puter.kv.incr('testCounter', 1)
  })

  decrBtn.addEventListener('click', async () => {
    kvLocal -= 1
    updateKvUi()
    await puter.kv.decr('testCounter', 1)
  })

  loadKv()
}
