import { defineConfig } from 'vitepress'
import { readdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'

function buildSidebarFromDirectory(dir, basePath = '/blog') {
  const items = []

  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    // 폴더들 먼저 처리 (생성순 정렬)
    const folders = entries
      .filter(entry => entry.isDirectory())
      .map(folder => {
        const folderPath = join(dir, folder.name)
        const stats = statSync(folderPath)
        return {
          name: folder.name,
          path: folderPath,
          birthtime: stats.birthtime
        }
      })
      .sort((a, b) => a.birthtime - b.birthtime) // 생성시간 오름차순 정렬

    for (const folder of folders) {
      const urlPath = `${basePath}/${folder.name}`
      const subItems = buildSidebarFromDirectory(folder.path, urlPath)

      if (subItems.length > 0) {
        items.push({
          text: folder.name,
          collapsed: false,
          items: subItems
        })
      }
    }

    // 마크다운 파일들 처리 (생성순 정렬)
    const mdFiles = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md')
      .map(file => {
        const filePath = join(dir, file.name)
        const stats = statSync(filePath)
        return {
          name: file.name,
          birthtime: stats.birthtime
        }
      })
      .sort((a, b) => a.birthtime - b.birthtime) // 생성시간 오름차순 정렬
      .map(file => ({
        text: file.name.replace('.md', ''),
        link: `${basePath}/${file.name.replace('.md', '')}`
      }))

    items.push(...mdFiles)

  } catch (error) {
    console.warn(`폴더 읽기 실패 ${dir}:`, error)
  }

  return items
}

const sidebar = (() => {
  try {
    const blogDir = join(process.cwd(), 'blog')
    if (!existsSync(blogDir)) return {}

    const sidebarItems = buildSidebarFromDirectory(blogDir)

    return {
      '/blog/': sidebarItems
    }
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
      level: 2,        // h2만 표시
      level: [1, 4],   // h1부터 h4까지 표시
      level: 'deep'    // 모든 레벨 표시 (1~6)
    },
    outlineTitle: '목차',
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
    },
    // breadcrumb 추가
    docFooter: {
      prev: '이전 페이지',
      next: '다음 페이지'
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