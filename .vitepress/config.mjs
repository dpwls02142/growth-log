import { defineConfig } from 'vitepress'
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'

const sidebar = (() => {
  try {
    const blogDir = join(process.cwd(), 'blog')
    if (!existsSync(blogDir)) return {}

    const categories = readdirSync(blogDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    const sidebarItems = categories.map(category => {
      const categoryDir = join(blogDir, category)
      const posts = readdirSync(categoryDir)
        .filter(file => file.endsWith('.md') && file !== 'index.md')
        .map(file => ({
          text: file.replace('.md', '').split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          link: `/blog/${category}/${file.replace('.md', '')}`
        }))

      return {
        text: category.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        collapsed: false,
        items: posts
      }
    })

    const result = {
      '/': sidebarItems,
      '/blog/': sidebarItems
    }

    categories.forEach(category => {
      result[`/blog/${category}/`] = sidebarItems
    })

    return result
  } catch (error) {
    console.warn('사이드바 생성 실패:', error)
    return {}
  }
})()

export default defineConfig({
  base: '/',
  cleanUrls: true,
  title: "Growth Log : by dpwls",
  description: "dpwls의 성장 일지",
  themeConfig: {
    outline: {
      level: [2, 3]
    },
    outlineTitle: '',
    nav: [
      { text: '홈', link: '/' },
      { text: '기술 블로그', link: 'https://dpwls02142.github.io/' },
    ],
    sidebar: sidebar,
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
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Growth Log' }],
    ['meta', { property: 'og:description', content: 'dpwls의 성장 일지' }],
    ['meta', { property: 'og:image', content: '/images/og-image.jpg' }],
    ['meta', { property: 'og:url', content: 'https://growth-log-kappa.vercel.app/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Growth Log' }],
    ['meta', { name: 'twitter:description', content: 'dpwls의 성장 일지' }],
    ['meta', { name: 'twitter:image', content: '/images/og-image.jpg' }],
  ]
}) 