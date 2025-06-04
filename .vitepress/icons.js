export const icons = {
  projects: `🦭`,
  nextjs: '⚛️',
  til: '📝'
}

export function getIcon(name) {
  return icons[name] ?? ''
}