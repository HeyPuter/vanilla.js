import './style.css'
import { initAi } from './examples/ai'
import { initFilesystem } from './examples/filesystem'
import { initKv } from './examples/kv'
import { initOs } from './examples/os'
import { initUi } from './examples/ui'
import { initTabs } from './examples/tabs'
import { appMarkup } from './templates/appMarkup'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found')
}

app.innerHTML = appMarkup

const init = () => {
  initTabs()
  initKv()
  initFilesystem()
  initOs()
  initUi()
  initAi()
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init()
} else {
  document.addEventListener('DOMContentLoaded', init)
}
