import './style.css'
import puter from '@heyputer/puter.js'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found')
}

app.innerHTML = `
  <div class="page-wrap">
    <header class="hero">
      <div class="logo-row">
        <a href="https://puter.com" target="_blank" rel="noreferrer">
          <img src="https://puter.com/images/logo.png" class="logo" alt="Puter logo" />
        </a>
      </div>
      <h1>Puter.js Examples</h1>
      <p class="hero-subtitle">Quick, runnable snippets for the most common Puter.js APIs.</p>
    </header>

    <nav class="tab-list" aria-label="Puter.js example tabs">
      <button class="tab active" type="button" data-tab="kv">
        <span class="tab-title">KV store</span>
        <span class="tab-desc">Get/set and increment counters</span>
      </button>
      <button class="tab" type="button" data-tab="fs">
        <span class="tab-title">File system</span>
        <span class="tab-desc">Read and write a demo file</span>
      </button>
      <button class="tab" type="button" data-tab="os">
        <span class="tab-title">OS</span>
        <span class="tab-desc">User profile + version info</span>
      </button>
      <button class="tab" type="button" data-tab="ai">
        <span class="tab-title">AI chat</span>
        <span class="tab-desc">Prompt Puter AI and see replies</span>
      </button>
      <button class="tab" type="button" data-tab="ui">
        <span class="tab-title">UI helpers</span>
        <span class="tab-desc">File picker example</span>
      </button>
    </nav>

    <main class="tab-panel">
      <section class="card stack tab-content" data-content="kv">
        <div class="stack">
          <h2>Puter KV Store</h2>
          <a href="https://docs.puter.com/KV/" target="_blank" rel="noreferrer">KV documentation</a>
        </div>
        <div class="counter-row">
          <button data-kv-action="decr" disabled>-</button>
          <span class="counter-value" data-kv-value>loading...</span>
          <button data-kv-action="incr" disabled>+</button>
        </div>
        <p class="status">
          This counter is stored in Puter KV as <code>testCounter</code>.
        </p>
      </section>

      <section class="card stack tab-content" data-content="fs" hidden>
        <div class="stack">
          <h2>Puter File System</h2>
          <p>
            Creates and reads a sample file at <code data-demo-path></code>. Uses your app data folder when
            available.
          </p>
        </div>

        <div class="actions">
          <button data-fs-action="write">Write file</button>
          <button data-fs-action="read">Read file</button>
        </div>

        <p class="status" data-fs-status>Status: Idle</p>

        <div class="callout" data-fs-callout hidden>
          <strong>File contents</strong>
          <pre data-fs-contents></pre>
        </div>
      </section>

      <section class="card stack tab-content" data-content="os" hidden>
        <div class="stack">
          <h2>Puter OS</h2>
          <p>Fetches the current user and OS version metadata from Puter.</p>
        </div>

        <div class="actions">
          <button data-os-action="user">Get current user</button>
          <button data-os-action="version">Get OS version</button>
        </div>

        <p class="status" data-os-status>Status: Idle</p>

        <div class="callout" data-os-user hidden>
          <strong>User info</strong>
          <pre data-os-user-pre></pre>
        </div>

        <div class="callout" data-os-version hidden>
          <strong>Version info</strong>
          <pre data-os-version-pre></pre>
        </div>
      </section>

      <section class="card stack tab-content" data-content="ai" hidden>
        <div class="stack">
          <h2>Puter AI Chat</h2>
          <p>
            Send a short prompt to <code>puter.ai.chat</code> and see the reply.
          </p>
        </div>

        <div class="chat-box">
          <textarea rows="3" placeholder="Ask Puter AI anything..." data-ai-input></textarea>
          <div class="actions">
            <button data-ai-send>Send message</button>
            <span class="status" data-ai-status>Status: Idle</span>
          </div>
        </div>

        <div class="callout" data-ai-history hidden>
          <strong>Conversation</strong>
          <div class="chat-history" data-ai-history-list></div>
        </div>
      </section>

      <section class="card stack tab-content" data-content="ui" hidden>
        <div class="stack">
          <h2>Puter UI</h2>
          <p>
            Single-file picker example using <code>puter.ui.showOpenFilePicker</code>.
          </p>
        </div>

        <div class="actions">
          <button data-ui-open>Open file picker</button>
        </div>

        <div class="callout">
          <strong>Last UI result</strong>
          <p data-ui-result>No UI actions yet</p>
        </div>
      </section>
    </main>
  </div>
`

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error))
const formatJSON = (data: Record<string, unknown>) => JSON.stringify(data, null, 2)
const extractText = (response: unknown): string => {
  if (!response || typeof response !== 'object') return 'No response received.'
  const maybe = response as { message?: { content?: unknown } }
  const content = maybe.message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    const first = content.find(part => typeof part === 'string')
    if (typeof first === 'string') return first
  }
  return JSON.stringify(content ?? response, null, 2)
}

const getDemoPath = () => {
  if (puter.appDataPath && puter.path?.join) {
    return puter.path.join(puter.appDataPath, 'puterjs-demo.txt')
  }
  return 'puterjs-demo.txt'
}

const initTabs = () => {
  const tabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-tab]'))
  const tabSections = Array.from(document.querySelectorAll<HTMLElement>('.tab-content'))

  const setActiveTab = (tabId: string) => {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId))
    tabSections.forEach(section => {
      const isActive = section.dataset.content === tabId
      section.hidden = !isActive
      section.classList.toggle('active-panel', isActive)
    })
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab || 'kv'))
  })

  setActiveTab('kv')
}

const initKv = () => {
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
    } catch (error) {
      kvLocal = 0
      console.error('KV load failed', error)
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

const initFs = () => {
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

const initOs = () => {
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

const initUi = () => {
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

const initAi = () => {
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

const init = () => {
  initTabs()
  initKv()
  initFs()
  initOs()
  initUi()
  initAi()
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init()
} else {
  document.addEventListener('DOMContentLoaded', init)
}
