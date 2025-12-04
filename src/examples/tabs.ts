export const initTabs = () => {
  const tabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-tab]'))
  const tabSections = Array.from(document.querySelectorAll<HTMLElement>('.tab-content'))

  if (!tabButtons.length || !tabSections.length) return

  const setActiveTab = (tabId: string) => {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId))
    tabSections.forEach(section => {
      const isActive = section.dataset.content === tabId
      section.hidden = !isActive
    })
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab || 'kv'))
  })

  setActiveTab('kv')
}
