export const appMarkup = `
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
