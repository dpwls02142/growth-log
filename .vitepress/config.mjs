import { defineConfig } from 'vitepress'
import { readdirSync } from 'fs'
import { join } from 'path'

function generateSidebar() {
  const blogDir = join(process.cwd(), 'blog')
  const categories = readdirSync(blogDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  const sidebarItems = categories.map(category => {
    const categoryDir = join(blogDir, category)
    const posts = readdirSync(categoryDir)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .map(file => ({
        text: file.replace('.md', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        link: `/blog/${category}/${file.replace('.md', '')}`
      }))

    return {
      text: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      collapsed: false,
      items: posts
    }
  })

  const sidebar = {
    '/': sidebarItems,
    '/blog/': sidebarItems
  }

  categories.forEach(category => {
    sidebar[`/blog/${category}/`] = sidebarItems
  })

  return sidebar
}

export default defineConfig({
  title: "Growth Log",
  description: "개발자의 성장 일지",
  themeConfig: {
    outline: {
      level: [2, 3]
    },
    outlineTitle: '',
    nav: [
      { text: '홈', link: '/' },
      { text: '기술 블로그', link: 'https://dpwls02142.github.io/' },
    ],
    sidebar: generateSidebar(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dpwls02142/' }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '검색',
            buttonAriaLabel: '검색'
          },
          modal: {
            noResultsText: '검색 결과가 없습니다',
            resetButtonTitle: '검색 초기화',
            footer: {
              selectText: '선택',
              navigateText: '이동',
              closeText: '닫기'
            }
          }
        }
      }
    }
  },
  head: [
    ['link', { rel: 'stylesheet', href: '/theme/custom.css' }],
  ]
}) 